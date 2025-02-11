import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';

@Module({
  providers: [],
  exports: [DatabaseModule],
})
export class SharedModule {}
