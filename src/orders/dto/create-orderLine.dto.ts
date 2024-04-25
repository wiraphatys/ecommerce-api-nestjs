import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class CreateOrderLineDto {
    orderId: string

    @IsNumber()
    @IsNotEmpty()
    readonly productId: number

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    readonly quantity: number
}