import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReminderService } from './reminder/reminder.service';
import { ReminderModule } from './reminder/reminder.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ConfigModule.forRoot(), ReminderModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
