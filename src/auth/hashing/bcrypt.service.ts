import { Logger } from '@nestjs/common';
import { HashingServiceProtocol } from './hashing.protocol';
import * as bcrypt from 'bcrypt';

export class BcryptService extends HashingServiceProtocol {
  async hash(data: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(data, salt);
    return hashed;
  }

  async compare(data: string, hashedData: string): Promise<boolean> {
    const isEqual = await bcrypt.compare(data, hashedData);
    return isEqual;
  }
}
