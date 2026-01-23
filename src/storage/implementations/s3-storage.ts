import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { StorageProtocol } from '../storage.protocol';
import { UploadResult } from '../dtos/upload-result.dto';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Storage implements StorageProtocol {
  private client: S3Client;
  private bucket: string;
  private region: string;

  constructor(private readonly configService: ConfigService) {
    this.region = configService.get('AWS_REGION');
    this.bucket = configService.get('AWS_S3_BUCKET');

    this.client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async upload(
    file: Express.Multer.File,
    path = 'uploads',
  ): Promise<UploadResult> {
    const key = `${path}/${randomUUID()}-${file?.originalname}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return {
      key,
      url: this.getPublicUrl(key),
      size: file.size,
      mimeType: file.mimetype,
    };
  }

  async delete(fileKey: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: fileKey,
      }),
    );
  }

  async getPresignedUrl(fileKey: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
    });
    const expiresIn: number =
      Number(this.configService.get('AWS_S3_SIGNED_URL_EXPIRES_IN')) ?? 60 * 5;
    return getSignedUrl(this.client, command, {
      expiresIn,
    });
  }

  getPublicUrl(fileKey: string): string {
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${fileKey}`;
  }
}
