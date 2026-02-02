import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { PaginationDto } from '../shared/dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingServiceProtocol } from '../auth/hashing/hashing.protocol';
import { TokenPayloadDto } from '../auth/dto/token-payload.dto';
import { StorageService } from '../storage/storage.service';
import { FileService } from '../file/file.service';
import { File } from '../file/entities/file.entity';
import { CreateFileDto } from '../file/dtos/create-file.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingServiceProtocol,
    private readonly storageService: StorageService,
    private readonly fileService: FileService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const passwordHash = await this.hashingService.hash(
        createUserDto.password,
      );
      const newUser: User = {
        name: createUserDto.name,
        email: createUserDto.email,
        passwordHash,
        birthDate: createUserDto.birthDate,
        createdAt: new Date(),
        updatedAt: new Date(),
        receivedReminders: [],
        sentReminders: [],
        picture: null,
      };
      this.logger.log(`Creating user: ${JSON.stringify(newUser)}`);
      const user = await this.usersRepository.save(newUser);
      return user;
    } catch (e) {
      const isEmailAlreadyTaken = e.code === 'ER_DUP_ENTRY';
      if (isEmailAlreadyTaken) {
        this.logger.warn(`Email ${createUserDto.email} is already taken`);
        throw new ConflictException('Email already taken');
      }
      this.logger.error(`Error creating user: ${e.message}`);
      throw new Error('Failed to create user');
    }
  }

  async findAll(queryParams: PaginationDto): Promise<User[]> {
    this.logger.log('Fetching all users');
    const { limit = 12, offset = 0 } = queryParams;
    try {
      const users = await this.usersRepository.find({
        order: { createdAt: 'DESC' },
        take: limit,
        skip: offset,
        relations: { picture: true },
      });

      await Promise.all(
        users.map(async (user) => {
          if (user.picture) {
            try {
              const presignedUrl = await this.storageService.getPresignedUrl(
                user.picture.key,
              );
              user.picture.url = presignedUrl;
            } catch (err) {
              this.logger.warn(
                `Failed to get presigned URL for user ${user.id}: ${err.message}`,
              );
              user.picture.url = '';
            }
          }
        }),
      );
      return users;
    } catch (e) {
      this.logger.error(`Error retrieving users: ${e.message}`);
      throw new Error('Failed to retrieve users');
    }
  }

  async findOne(id: string): Promise<User> {
    this.logger.log(`Fetching user with id ${id}`);
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
      relations: {
        picture: true,
        receivedReminders: true,
        sentReminders: true,
      },
    });

    if (user && user.picture) {
      const presignedUrl = await this.storageService.getPresignedUrl(
        user?.picture?.key,
      );
      user.picture.url = presignedUrl;
    }

    this.logger.log('user', JSON.stringify(user));
    if (!user || user.deletedAt) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    tokenPayloadDto: TokenPayloadDto,
  ): Promise<User> {
    this.logger.log(`Updating user with id ${id}`);

    const isSameUser = tokenPayloadDto.sub === id;

    if (!isSameUser) {
      throw new ConflictException('You can only update your own account');
    }

    const user = await this.usersRepository.preload({ id });

    let updatedUser: User = {
      ...user,
      ...updateUserDto,
      updatedAt: new Date(),
    };

    if (updateUserDto.password) {
      const newPasswordHash = await this.hashingService.hash(
        updateUserDto.password,
      );
      updatedUser = {
        ...updatedUser,
        passwordHash: newPasswordHash,
      };
    }

    if (!user || user.deletedAt) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return await this.usersRepository.save(updatedUser);
  }

  async remove(id: string, tokenPayloadDto: TokenPayloadDto) {
    this.logger.log(`Removing user with id ${id}`);
    const user = await this.usersRepository.preload({ id });
    const isSameUser = tokenPayloadDto.sub === id;

    if (!isSameUser) {
      throw new ConflictException('You can only delete your own account');
    }

    if (!user || user.deletedAt) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return await this.usersRepository.softDelete(id);
  }

  public async findByEmail(email: string): Promise<User | null> {
    this.logger.log(`Finding user by email: ${email}`);
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  public async uploadUserPicture(
    id: string,
    tokenPayloadDto: TokenPayloadDto,
    file: Express.Multer.File,
  ) {
    const isSameUser = tokenPayloadDto.sub === id;
    if (!isSameUser) {
      throw new ConflictException('You can only update your own account');
    }
    this.logger.log('Uploading user picture');
    const result = await this.storageService.upload(file, 'picture');
    const createFileDto: CreateFileDto = {
      key: result.key,
      filename: file.filename,
      size: result.size,
      mimeType: result.mimeType,
      url: result.url,
    };
    const uploadedFile: File = await this.fileService.createFile(createFileDto);
    const presignedUrl = await this.storageService.getPresignedUrl(result.key);
    uploadedFile.url = presignedUrl;
    this.logger.log(`updating user picture ${JSON.stringify(result)}`);

    const preloadedUser = await this.usersRepository.findOne({
      where: { id },
      relations: { picture: true },
    });
    if (
      preloadedUser?.picture &&
      preloadedUser.picture.id !== uploadedFile.id
    ) {
      try {
        await this.fileService.deleteFile(preloadedUser.picture.id);
      } catch (err) {
        this.logger.warn(`Failed to delete old picture file: ${err.message}`);
      }
    }
    const updatedUser: User = {
      ...preloadedUser,
      picture: uploadedFile,
    };
    await this.usersRepository.update(id, updatedUser);
    return result;
  }
}
