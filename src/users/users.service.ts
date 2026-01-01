import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import bcrypt from 'bcrypt';
import { USER_REPOSITORY } from './users.providers';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
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
    };

    const user = await this.usersRepository.save(newUser);
    return user;
  }

  async findAll() {
    const users = await this.usersRepository.find({
      where: { isActive: true },
    });
    return users;
  }

  async findOne(id: string) {
    const user = await this.usersRepository.preload({ id });
    if (!user || !user.isActive) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
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
    const user = await this.usersRepository.preload({ id });
    if (!user || !user.isActive) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.usersRepository.softDelete(id);
    return `This action removes a #${id} user`;
  }
}
