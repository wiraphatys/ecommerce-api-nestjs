import { IsNotEmpty, IsNumber } from "class-validator"

export class CreateCartDto {
    userId: number

    @IsNumber()
    @IsNotEmpty()
    productId: number

    @IsNumber()
    @IsNotEmpty()
    readonly quantity: number
}
