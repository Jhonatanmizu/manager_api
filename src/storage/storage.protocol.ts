import { UploadResult } from './dtos/upload-result.dto';

export interface StorageProtocol {
  upload(file: Express.Multer.File, path?: string): Promise<UploadResult>;
  delete(fileKey: string): Promise<void>;
  getPublicUrl(fileKey: string): string;
  getPresignedUrl(fileKey: string, expiresIn?: number): Promise<string>;
}
