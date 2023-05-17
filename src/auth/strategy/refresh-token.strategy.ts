/* eslint-disable prettier/prettier */
import { Injectable, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly cfgService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: cfgService.get<string>('SECRET_REFRESH_TOKEN_KEY'),
      passReqToCallBack: true,
    });
  }

  async validate(payload: { subject: string; role: string }) {
    console.log(payload.subject, payload.role);

    const user = await this.userService.findById(payload.subject);

    delete user.password;
    return user;
  }
}
