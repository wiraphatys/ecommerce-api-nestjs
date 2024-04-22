import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
    @IsOptional()
    readonly fname?: string

    @IsString()
    @IsOptional()
    readonly lname?: string

    @IsEmail()
    @IsOptional()
    readonly email?: string

    @IsString()
    @IsOptional()
    readonly username?: string

    @IsString()
    @IsOptional()
    password?: string

    @IsPhoneNumber('TH')
    @IsOptional()
    readonly tel?: string

    @IsNumber()
    @IsEmpty()
    readonly roleId: number
}
