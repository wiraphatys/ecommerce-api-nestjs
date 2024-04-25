import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class CreateOrderDto {
    id: string
    
    @IsNumber()
    @IsNotEmpty()
    readonly userId: number
}
