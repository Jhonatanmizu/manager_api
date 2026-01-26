import { UploadResult } from './dtos/upload-result.dto';

export abstract class StorageProtocol {
  abstract upload(
    file: Express.Multer.File,
    path?: string,
  ): Promise<UploadResult>;
  abstract delete(fileKey: string): Promise<void>;
  abstract getPublicUrl(fileKey: string): string;
  abstract getPresignedUrl(
    fileKey: string,
    expiresIn?: number,
  ): Promise<string>;
}
