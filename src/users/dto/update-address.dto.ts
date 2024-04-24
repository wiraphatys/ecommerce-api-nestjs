import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { CreateAddressDto } from './create-address.dto';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
    @IsString()
    @IsOptional()
    houseNumber: string;

    @IsString()
    @IsOptional()
    street: string;

    @IsString()
    @IsOptional()
    district: string;

    @IsString()
    @IsOptional()
    city: string;

    @IsString()
    @IsOptional()
    postalCode: string;
}
