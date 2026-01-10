import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { CreateReminderDto } from './dtos/create-reminder.dto';
import { UpdateReminderDto } from './dtos/update-reminder.dto';
import { PaginationDto } from '../shared/dtos';
import { TimingConnectionInterceptor } from '../shared/interceptors';

@Controller('/v1/reminder')
@UseInterceptors(TimingConnectionInterceptor)
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}
  @Get()
  async findAll(@Query() queryParams: PaginationDto) {
    return await this.reminderService.findAll(queryParams);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.reminderService.findOne(id);
  }

  @Post()
  async create(@Body() createReminderDto: CreateReminderDto) {
    return this.reminderService.create(createReminderDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateReminderDto) {
    return await this.reminderService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.reminderService.remove(id);
  }
}
