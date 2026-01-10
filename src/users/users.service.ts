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
import bcrypt from 'bcrypt';
import { PaginationDto } from '../shared/dtos';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const passwordHash = await bcrypt.hash(createUserDto.password, 10);
      const newUser: User = {
        ...createUserDto,
        name: createUserDto.name,
        email: createUserDto.email,
        passwordHash,
        isActive: true,
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
      where: { isActive: true },
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
    if (!user || !user.isActive) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    this.logger.log(`Updating user with id ${id}`);
    const user = await this.usersRepository.preload({ id });
    if (!user || !user.isActive) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const updatedUser = await this.usersRepository.save({
      ...user,
      ...updateUserDto,
      updatedAt: new Date(),
    });

    return updatedUser;
  }

  async remove(id: string) {
    this.logger.log(`Removing user with id ${id}`);
    const user = await this.usersRepository.preload({ id });
    if (!user || !user.isActive) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return await this.usersRepository.softDelete(id);
  }
}
