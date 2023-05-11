import { Type } from "class-transformer";
import { IsNotEmpty,IsNumber,Min,MinLength } from "class-validator";

export class CreateProductDTO {
    @IsNotEmpty()
    @MinLength(3)
    name:string;

    image: string;

    @IsNumber()
    @Min(1)
    @Type(()=> Number)
    price: number;

    @Min(0)
    @Type(()=> Number)
    sale_price: number;

    @IsNotEmpty()
    status: number;
    
    @IsNotEmpty()
    description: string;
};
