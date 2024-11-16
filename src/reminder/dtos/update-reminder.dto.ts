import { PartialType } from '@nestjs/mapped-types';
import { CreateReminderDto } from './create-reminder.dto';
import { IsBoolean, isBoolean, IsOptional } from 'class-validator';

export class UpdateReminderDto extends PartialType(CreateReminderDto) {
  @IsBoolean()
  @IsOptional()
  readonly seen: boolean;
}
