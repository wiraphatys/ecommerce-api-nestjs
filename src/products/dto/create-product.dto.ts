import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string

    @IsNumber()
    @IsNotEmpty()
    readonly unitPrice: number

    @IsNumber()
    @IsNotEmpty()
    readonly cost: number

    @IsNumber()
    @IsNotEmpty()
    readonly quantity: number

    @IsNumber()
    @IsNotEmpty()
    readonly categoryId: number
}
