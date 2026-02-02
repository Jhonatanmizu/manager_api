import { Injectable, Logger } from '@nestjs/common';
import { CreateFileDto } from './dtos/create-file.dto';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(private readonly fileRepo: Repository<File>) {}

  async createFile(createFileDto: CreateFileDto) {
    const result = await this.fileRepo.save(createFileDto);
    this.logger.log(`File created with key: ${result.key}`);
    return result;
  }

  async deleteFile(fileId: string): Promise<void> {
    this.logger.log(`Deleting file with id: ${fileId}`);
    const file = await this.fileRepo.findOne({ where: { id: fileId } });
    if (!file) {
      this.logger.warn(`File with id ${fileId} not found.`);
      return;
    }
    await this.fileRepo.softDelete(fileId);
    this.logger.log(`File with id ${fileId} deleted.`);
  }
}
