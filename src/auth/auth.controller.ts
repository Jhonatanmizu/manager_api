import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('/v1/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    this.logger.log(`Hit /sign-in endpoint`);
    return await this.authService.signIn(signInDto);
  }

  @Post('/refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    this.logger.log(`Hit /refresh-token endpoint`);
    return await this.authService.refreshToken(refreshTokenDto);
  }
}
