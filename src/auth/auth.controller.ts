import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

@Controller('/v1/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    this.logger.log(`Hit /sign-in endpoint`);
    return await this.authService.signIn(signInDto);
  }
}
