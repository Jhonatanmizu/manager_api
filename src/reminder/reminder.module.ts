import { ReminderService } from './reminder.service';
import { Module } from '@nestjs/common';
import { ReminderController } from './reminder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reminder } from './entities/reminder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reminder])],
  providers: [ReminderService],
  controllers: [ReminderController],
})
export class ReminderModule {}
