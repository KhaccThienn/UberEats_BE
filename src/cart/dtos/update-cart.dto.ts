/* eslint-disable prettier/prettier */
import { Expose } from "class-transformer";

export class UpdateCartDTO {
     @Expose()
     prodId: number;

     @Expose()
     quantity?: number;
     
     @Expose()
     userId: number;
}
