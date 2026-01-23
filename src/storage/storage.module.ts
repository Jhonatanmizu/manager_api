import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { STORAGE_PROVIDER } from './constants';
import { S3Storage } from './implementations/s3-storage';

@Module({
  providers: [
    StorageService,
    {
      provide: STORAGE_PROVIDER,
      useClass: S3Storage,
    },
  ],
  exports: [StorageService],
})
export class StorageModule {}
