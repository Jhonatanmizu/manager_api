import { ConfigType } from '@nestjs/config';
import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { UsersService } from 'src/users/users.service';
import { HashingServiceProtocol } from './hashing/hashing.protocol';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UsersService,
    private readonly hashingService: HashingServiceProtocol,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
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

    return this.generateTokens(user);
  }

  private async generateTokens(user: User) {
    const accessTokenPromise = await this.signJwtTokenAsync<Partial<User>>(
      user.id,
      this.jwtConfiguration.JWT_EXPIRES_IN,
      { email: user.email },
    );

    const refreshTokenPromise = await this.signJwtTokenAsync(
      user.id,
      this.jwtConfiguration.JWT_REFRESH_EXPIRES_IN,
    );
    const promises = [accessTokenPromise, refreshTokenPromise];
    const [access_token, refresh_token] = await Promise.all(promises);

    return {
      access_token,
      refresh_token,
    };
  }

  private async signJwtTokenAsync<T>(
    sub: string,
    expiresIn: number,
    payload?: T,
  ) {
    return await this.jwtService.signAsync(
      { sub, ...payload },
      {
        secret: this.jwtConfiguration.JWT_SECRET,
        audience: this.jwtConfiguration.JWT_TOKEN_AUDIENCE,
        issuer: this.jwtConfiguration.JWT_TOKEN_ISSUER,
        expiresIn,
      },
    );
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    this.logger.log(`Token refresh attempt`);
    try {
      const result: Partial<User & { sub: string }> =
        await this.jwtService.verifyAsync(refreshTokenDto.refreshToken, {
          secret: this.jwtConfiguration.JWT_SECRET,
          audience: this.jwtConfiguration.JWT_TOKEN_AUDIENCE,
          issuer: this.jwtConfiguration.JWT_TOKEN_ISSUER,
        });
      const user = await this.userService.findOne(result.sub);

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
