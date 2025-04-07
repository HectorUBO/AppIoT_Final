import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { InitialLoginDto } from './dto/initial-login.dto';
import { VerifySecurityDto } from './dto/verify-security.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('initial-login')
  @UsePipes(new ValidationPipe())
  async initialLogin(@Body() initialLoginDto: InitialLoginDto) {
    return this.authService.initialLogin(
      initialLoginDto.email,
      initialLoginDto.password
    );
  }

  @Post('verify-security')
  @UsePipes(new ValidationPipe())
  async verifySecurity(@Body() verifySecurityDto: VerifySecurityDto) {
    return this.authService.verifySecurityAnswer(
      verifySecurityDto.tempToken,
      verifySecurityDto.answer
    );
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}