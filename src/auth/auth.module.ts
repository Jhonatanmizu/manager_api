import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { HashingServiceProtocol } from './hashing/hashing.protocol';
import { BcryptService } from './hashing/bcrypt.service';
import { UsersModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { AuthService } from './auth.service';
import { JwtModule, JwtModuleAsyncOptions } from '@nestjs/jwt';
@Global()
@Module({
  imports: [
    UsersModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider() as JwtModuleAsyncOptions),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: HashingServiceProtocol,
      useClass: BcryptService,
    },
    AuthService,
  ],
  exports: [HashingServiceProtocol, JwtModule, ConfigModule],
})
export class AuthModule {}
