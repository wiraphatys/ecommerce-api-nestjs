import { IsNotEmpty, IsNumber, IsPositive } from "class-validator"
import { CreateOrderLineDto } from "./create-orderLine.dto"

export class CreateOrderDataDto {
    id: string
    userId: number

    @IsNotEmpty()
    items: CreateOrderLineDto[]
}
