/* eslint-disable prettier/prettier */
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import * as argon from 'argon2';
import { Repository, UpdateResult } from 'typeorm';
import { RegisterDTO } from './DTOS/register.dto';
import { LoginDTO } from './DTOS/login.dto';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private jwtService: JwtService,
    private cfgService: ConfigService,
    private userService: UserService,
  ) {}
  private logger = new Logger();

  async hashedData(password: string): Promise<string> {
    return await argon.hash(password);
  }

  async doesUserExist(email: string): Promise<User> {
    return this.userRepo.findOne({
      where: [
        {
          email: email,
        },
      ],
    });
  }

  async registerAccount(user: RegisterDTO): Promise<User> {
    const exists_user_email = await this.doesUserExist(user.email);
    const exists_user_phone = await this.userRepo.findOne({
      where: [
        {
          phone: user.phone,
        },
      ],
    });
    if (exists_user_email && exists_user_phone) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'Both email and phone are already exist',
        },
        HttpStatus.CONFLICT,
      );
    }
    if (exists_user_email) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'This email address is already exists',
        },
        HttpStatus.CONFLICT,
      );
    }
    if (exists_user_phone) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'This phone number is already exists',
        },
        HttpStatus.CONFLICT,
      );
    }
    const hashedPassword = await this.hashedData(user.password);
    user.password = hashedPassword;
    console.log(user);
    return this.userRepo.save({
      userName: user.userName,
      email: user.email,
      phone: user.phone,
      password: user.password,
      role: user.role,
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepo.findOne({
      where: [
        {
          email: email,
        },
      ],
      select: ['id', 'userName', 'password', 'role'],
    });
    if (!user) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Account does not exist' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const matchPass = await argon.verify(user.password, password);
    if (!matchPass) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: 'Password does not match' },
        HttpStatus.BAD_REQUEST,
      );
    }
    delete user.password;
    return user;
  }

  async login(user: LoginDTO): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const userFound = await this.validateUser(user.email, user.password);
    if (!userFound) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: 'Invalid Credentials' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const tokens = await this.signJwtToken(userFound.id, userFound.role);
    await this.updateRefreshToken(userFound.id.toString(), tokens.refreshToken);
    return tokens;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashedData(refreshToken);
    await this.userService.update(userId, {
      refresh_token: hashedRefreshToken,
    });
  }

  async logOut(userId: string): Promise<UpdateResult> {
    return this.userService.update(userId, {
      refresh_token: null,
    });
  }

  async refreshTokens(userID: string, refreshToken: string) {
    const user = await this.userService.findById(userID);
    console.log('Rf Token: ', refreshToken);
    console.log('User RF token: ', user.refresh_token);

    if (!user || !user.refresh_token) {
      throw new ForbiddenException('Access denied');
    }

    const rfTokenVerified = await argon.verify(
      user.refresh_token,
      refreshToken,
    );

    if (!rfTokenVerified) {
      throw new ForbiddenException('Access denied - RF Token Does Not Match');
    }

    const tokens = await this.signJwtToken(user.id, user.role);

    // update field refresh token trong database
    await this.updateRefreshToken(user.id.toString(), tokens.refreshToken);
    console.log('Refresh token updated', tokens);

    return tokens;
  }
  
  async signJwtToken(
    id: number,
    role: number,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload = {
      subject: id,
      role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.SECRET_TOKEN_KEY,
        expiresIn: '1d',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.SECRET_REFRESH_TOKEN_KEY,
        expiresIn: '30d',
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
}
