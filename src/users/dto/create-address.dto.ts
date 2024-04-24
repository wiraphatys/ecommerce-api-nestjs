import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAddressDto {
    userId: number;

    @IsString()
    @IsNotEmpty()
    houseNumber: string;

    @IsString()
    @IsNotEmpty()
    street: string;

    @IsString()
    @IsNotEmpty()
    district: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    postalCode: string;
}
