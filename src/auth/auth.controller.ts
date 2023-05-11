/* eslint-disable prettier/prettier */
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/user/entity/user.entity';
import { RegisterDTO } from './DTOS/register.dto';
import { LoginDTO } from './DTOS/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  register(@Body() user: RegisterDTO): Promise<User> {
    return this.authService.registerAccount(user);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() user: LoginDTO): Promise<{ accessToken: string }> {
    return this.authService.login(user);
  }
}
