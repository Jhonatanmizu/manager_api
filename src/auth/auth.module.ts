import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { HashingServiceProtocol } from './hashing/hashing.protocol';
import { BcryptService } from './hashing/bcrypt.service';
import { UsersModule } from 'src/users/users.module';

@Global()
@Module({
  imports: [UsersModule],
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
