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
    const payload = { sub: user.id, email: user.email, name: user.name };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfiguration.JWT_SECRET,
      audience: this.jwtConfiguration.JWT_TOKEN_AUDIENCE,
      issuer: this.jwtConfiguration.JWT_TOKEN_ISSUER,
      expiresIn: this.jwtConfiguration.JWT_EXPIRES_IN,
    });

    return {
      access_token,
    };
  }

  async refreshToken(token: string) {
    this.logger.log(`Token refresh attempt`);
    const result = await this.jwtService.verifyAsync(token);
    const decoded = this.jwtService.decode(token);
    if (!result) {
      throw new UnauthorizedException('Invalid token');
    }
    return this.jwtService.signAsync(decoded);
  }
}
