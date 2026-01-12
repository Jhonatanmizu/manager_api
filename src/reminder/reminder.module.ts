import { ReminderService } from './reminder.service';
import { Module } from '@nestjs/common';
import { ReminderController } from './reminder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reminder } from './entities/reminder.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reminder]), UsersModule],
  providers: [ReminderService],
  controllers: [ReminderController],
  exports: [],
})
export class ReminderModule {}
