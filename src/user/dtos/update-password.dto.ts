/* eslint-disable prettier/prettier */
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Match } from 'src/decorators/match.decorator';
import { Role } from 'src/model/role.enum';

/* eslint-disable prettier/prettier */
export class UpdatePasswordDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  old_password: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  new_password: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  @Match('new_password')
  confirm_password: string;
}
