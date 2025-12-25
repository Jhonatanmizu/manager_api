import { ReminderService } from './reminder.service';
import { Module } from '@nestjs/common';
import { ReminderController } from './reminder.controller';
import { reminderProviders } from './reminder.providers';
import { DatabaseModule } from '../shared/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ReminderService, ...reminderProviders],
  controllers: [ReminderController],
  exports: [...reminderProviders],
})
export class ReminderModule {}
