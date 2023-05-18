/* eslint-disable prettier/prettier */
import { Expose } from "class-transformer";

export class CreateVoucherDTO {
    @Expose()
    name: string;
    
    @Expose()
    discount: number;

    @Expose()
    restaurantId: number;
};
