import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReminderService } from './reminder/reminder.service';
import { ReminderModule } from './reminder/reminder.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      password: 'water',
      username: 'mizu',
      port: 5432,
      host: 'localhost',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ReminderModule,
  ],
  controllers: [AppController],
  providers: [AppService, ReminderService],
})
export class AppModule {}
