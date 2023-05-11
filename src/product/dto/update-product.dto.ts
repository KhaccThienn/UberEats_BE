import { IsNotEmpty, MinLength } from "class-validator";

export class UpdateProductDTO {
    @IsNotEmpty()
    @MinLength(3)
    name:string;

    image: string;

    price: number;

    sale_price: number;

    @IsNotEmpty()
    status: number;
    
    description: string;
};
