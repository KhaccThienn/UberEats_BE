/* eslint-disable prettier/prettier */
import { Expose, Type } from "class-transformer";
import { IsNotEmpty,IsNumber,Min,MinLength } from "class-validator";
export class UpdateProductDTO {
    @IsNotEmpty()
    @MinLength(3)
    @Expose()
    name:string;

    @Expose()
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
    
    @Expose()
    description: string;

    restaurantId: number;
};
