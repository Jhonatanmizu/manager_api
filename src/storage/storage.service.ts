import { Inject, Injectable } from '@nestjs/common';
import { STORAGE_PROVIDER } from './constants';
import { StorageProtocol } from './storage.protocol';

@Injectable()
export class StorageService {
  constructor(
    @Inject(STORAGE_PROVIDER)
    private readonly storage: StorageProtocol,
  ) {}

  upload(file: Express.Multer.File, path?: string) {
    return this.storage.upload(file, path);
  }

  delete(fileKey: string) {
    return this.storage.delete(fileKey);
  }

  getPublicUrl(fileKey: string) {
    return this.storage.getPublicUrl(fileKey);
  }
}
