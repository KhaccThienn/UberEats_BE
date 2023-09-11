/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, MinLength, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @MinLength(3)
  @IsString()
  @Expose()
  userName?: string;

  @ApiProperty()
  avatar?: string;

  @ApiProperty()
  @Expose()
  email?: string;
  
  @ApiProperty()
  @Expose()
  phone?: string;
  
  @ApiProperty()
  @Expose()
  address?: string;
  
  @ApiProperty()
  refresh_token?: string;
}
