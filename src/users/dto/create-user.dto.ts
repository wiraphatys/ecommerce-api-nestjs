import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    readonly fname: string

    @IsString()
    @IsNotEmpty()
    readonly lname: string

    @IsEmail()
    @IsNotEmpty()
    readonly email: string

    @IsString()
    @IsNotEmpty()
    readonly username: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsPhoneNumber('TH')
    @IsNotEmpty()
    readonly tel: string

    @IsNumber()
    @IsNotEmpty()
    readonly roleId: number
}
