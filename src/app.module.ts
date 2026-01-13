import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReminderModule } from './reminder/reminder.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import globalConfig from './config/global-config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forFeature(globalConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(globalConfig), AuthModule],
      inject: [globalConfig.KEY],
      useFactory: (globalConfigurations: ConfigType<typeof globalConfig>) => {
        return {
          type: globalConfigurations.database.type,
          host: globalConfigurations.database.host,
          port: globalConfigurations.database.port,
          username: globalConfigurations.database.username,
          database: globalConfigurations.database.database,
          password: globalConfigurations.database.password,
          autoLoadEntities: globalConfigurations.database.autoLoadEntities,
          synchronize: globalConfigurations.database.synchronize,
        };
      },
    }),
    ReminderModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
