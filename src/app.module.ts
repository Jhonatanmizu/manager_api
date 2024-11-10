import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReminderService } from './reminder/reminder.service';
import { ReminderModule } from './reminder/reminder.module';

@Module({
  imports: [ReminderModule],
  controllers: [AppController],
  providers: [AppService, ReminderService],
})
export class AppModule {}
