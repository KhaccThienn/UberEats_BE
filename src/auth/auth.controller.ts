/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/user/entity/user.entity';
import { RegisterDTO } from './DTOS/register.dto';
import { Request } from 'express';
import { LoginDTO } from './DTOS/login.dto';
import { AccessTokenGuard, RefreshTokenGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  register(@Body() user: RegisterDTO): Promise<User> {
    console.log(user);
    
    return this.authService.registerAccount(user);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() user: LoginDTO): Promise<{ accessToken: string }> {
    return this.authService.login(user);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req: Request) {
    console.log(req.user);
    
    return this.authService.logOut(req.user['subject']);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req.user['id'];
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
