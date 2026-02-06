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
  UseGuards,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../shared/dtos';
import { TimingConnectionInterceptor } from '../shared/interceptors';
import { AuthGuard } from '../auth/guards/auth-token.guard';
import { TokenPayloadDto } from '../auth/dto/token-payload.dto';
import { TokenPayloadParam } from '../auth/params/token-payload.param';
import { multerConfig } from 'src/config/multer.config';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/v1/user')
@UseInterceptors(TimingConnectionInterceptor)
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    this.logger.log('Hit create user');
    return await this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Param() queryParams: PaginationDto) {
    this.logger.log('Hit find all users');
    return await this.usersService.findAll(queryParams);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log('Hit find one user');
    return await this.usersService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    this.logger.log('Hit update user');
    return await this.usersService.update(id, updateUserDto, tokenPayload);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    this.logger.log('Hit delete user');
    return await this.usersService.remove(id, tokenPayload);
  }

  @UseGuards(AuthGuard)
  @Post(':id/picture')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async updateProfilePicture(
    @Param('id') id: string,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    this.logger.log('Hit upload profile picture');
    return await this.usersService.uploadUserPicture(id, tokenPayload, file);
  }
}
