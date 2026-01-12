import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { HashingServiceProtocol } from './hashing/hashing.protocol';
import { BcryptService } from './hashing/bcrypt.service';

@Global()
@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    {
      provide: HashingServiceProtocol,
      useClass: BcryptService,
    },
  ],
  exports: [HashingServiceProtocol],
})
export class AuthModule {}
