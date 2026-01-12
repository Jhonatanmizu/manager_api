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

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingServiceProtocol,
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
    const users = await this.usersRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: limit,
      skip: offset,
    });
    return users;
  }

  async findOne(id: string): Promise<User> {
    this.logger.log(`Fetching user with id ${id}`);
    const user = await this.usersRepository.preload({ id });
    if (!user || !user.deletedAt) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    this.logger.log(`Updating user with id ${id}`);
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

    if (!user || !user.deletedAt) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return await this.usersRepository.save(updatedUser);
  }

  async remove(id: string) {
    this.logger.log(`Removing user with id ${id}`);
    const user = await this.usersRepository.preload({ id });
    if (!user || !user.deletedAt) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return await this.usersRepository.softDelete(id);
  }
}
