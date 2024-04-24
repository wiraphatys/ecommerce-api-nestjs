import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @IsString()
    @IsOptional()
    readonly name?: string

    @IsNumber()
    @IsOptional()
    readonly unitPrice?: number

    @IsNumber()
    @IsOptional()
    readonly cost?: number

    @IsNumber()
    @IsOptional()
    readonly quantity?: number

    @IsNumber()
    @IsOptional()
    readonly categoryId?: number
}
