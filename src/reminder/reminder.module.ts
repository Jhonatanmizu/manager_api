import { ReminderService } from './reminder.service';
import { Module } from '@nestjs/common';
import { ReminderController } from './reminder.controller';

@Module({
  providers: [ReminderService],
  controllers: [ReminderController],
})
export class ReminderModule {}
