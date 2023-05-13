import { Expose } from 'class-transformer';
import { IsNotEmpty,MinLength, IsString, IsEmail } from 'class-validator';

export class CreateRestaurantDTO {
    @IsNotEmpty()
    @MinLength(3)
    @IsString()
    @Expose()
    name: string;

    @IsNotEmpty()
    @IsString()
    @Expose()
    address: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @Expose()
    email: string;

    @IsNotEmpty()
    @Expose()
    phone: string;
}
