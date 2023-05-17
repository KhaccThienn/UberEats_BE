/* eslint-disable prettier/prettier */
import { Expose, Type } from "class-transformer";
import { IsNotEmpty,IsNumber,Min,MinLength } from "class-validator";

export class CreateProductDTO {
    @IsNotEmpty()
    @MinLength(3)
    @Expose()
    name:string;

    image: string;

    @IsNumber()
    @Min(1)
    @Type(()=> Number)
    @Expose()
    price: number;

    @Min(0)
    @Type(()=> Number)
    @Expose()
    sale_price: number;

    @IsNotEmpty()
    @Expose()
    status: number;
    
    @IsNotEmpty()
    @Expose()
    description: string;

    restaurantId: number;
};
