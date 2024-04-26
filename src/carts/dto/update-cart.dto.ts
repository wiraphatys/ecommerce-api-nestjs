import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';
import { IsEmpty, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCartDto extends PartialType(CreateCartDto) {
    @IsEmpty()
    userId: number

    @IsEmpty()
    productId: number

    @IsNumber()
    @IsNotEmpty()
    readonly quantity: number
}
