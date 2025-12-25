import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReminderService } from './reminder/reminder.service';
import { ReminderModule } from './reminder/reminder.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ReminderModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, ReminderService],
})
export class AppModule {}
