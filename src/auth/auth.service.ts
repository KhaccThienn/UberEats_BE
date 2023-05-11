/* eslint-disable prettier/prettier */
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import * as argon from 'argon2';
import { Repository } from 'typeorm';
import { RegisterDTO } from './DTOS/register.dto';
import { LoginDTO } from './DTOS/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private jwtService: JwtService,
    private cfgService: ConfigService,
  ) {}

  async hashPassword(password: string): Promise<string> {
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
    const exists_user = this.doesUserExist(user.email);
    if (exists_user) {
      throw new ForbiddenException(`User ${user.username} already exists`);
    }
    const hashedPassword = await this.hashPassword(user.password);
    user.password = hashedPassword;

    return this.userRepo.save({
      username: user.username,
      email: user.email,
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
      select: ['id', 'username', 'password', 'role'],
    });
    if (!user) {
      throw new HttpException(
        { status: HttpStatus.FORBIDDEN, error: 'Invalid Credentials' },
        HttpStatus.FORBIDDEN,
      );
    }
    const matchPass = await argon.verify(password, user.password);
    if (!matchPass) {
      throw new HttpException(
        { status: HttpStatus.FORBIDDEN, error: 'Pass does not match' },
        HttpStatus.FORBIDDEN,
      );
    }
    delete user.password;
    return user;
  }

  async login(user: LoginDTO): Promise<{ accessToken: string }> {
    const userFound = await this.validateUser(user.email, user.password);
    if (!userFound) {
      throw new HttpException(
        { status: HttpStatus.FORBIDDEN, error: 'Invalid Credentials' },
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.signJwtToken(userFound.username, userFound.role);
  }

  async signJwtToken(
    username: string,
    role: number,
  ): Promise<{ accessToken: string }> {
    const payload = {
      subject: username,
      role,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '10m',
      secret: this.cfgService.get('SECRET_TOKEN_KEY'),
    });

    return {
      accessToken: accessToken,
    };
  }
}
