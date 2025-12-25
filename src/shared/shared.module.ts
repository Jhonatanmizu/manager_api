import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { databaseProviders } from './database/database.providers';

@Module({
  providers: [],
  exports: [DatabaseModule, ...databaseProviders],
})
export class SharedModule {}
