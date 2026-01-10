import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../shared/dtos';
import { TimingConnectionInterceptor } from '../shared/interceptors';

@Controller('/v1/user')
@UseInterceptors(TimingConnectionInterceptor)
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    this.logger.log('Hit create user');
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Param() queryParams: PaginationDto) {
    this.logger.log('Hit find all users');
    return this.usersService.findAll(queryParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.log('Hit find one user');
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    this.logger.log('Hit update user');
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.log('Hit delete user');
    return this.usersService.remove(id);
  }
}
