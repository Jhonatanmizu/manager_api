import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { UsersService } from 'src/users/users.service';
import { HashingServiceProtocol } from './hashing/hashing.protocol';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UsersService,
    private readonly hashingService: HashingServiceProtocol,
  ) {}

  async signIn(sigInData: SignInDto) {
    this.logger.log(`Sign-in attempt for email: ${sigInData.email}`);
    const { email, password } = sigInData;
    const user = await this.userService.findByEmail(email);
    const isEqualPasswordHash = this.hashingService.compare(
      password,
      user.passwordHash,
    );

    if (!isEqualPasswordHash) {
      this.logger.warn(`Invalid password for email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    return { message: 'Sign-in successful', user };
  }

  signOut(userId: string) {
    this.logger.log(`Sign-out attempt for user ID: ${userId}`);
    // Implement sign-out logic here
    return { message: 'Sign-out successful', userId };
  }

  refreshToken(userId: string) {
    this.logger.log(`Token refresh attempt for user ID: ${userId}`);
    // Implement token refresh logic here
    return { message: 'Token refreshed', userId };
  }
}
