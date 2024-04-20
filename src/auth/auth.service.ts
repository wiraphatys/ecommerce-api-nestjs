import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly jwtService: JwtService
    ) { }
    async login(loginUserDto: LoginUserDto): Promise<{token: string, err: string}> {
        try {
            const existUser = await this.databaseService.user.findUnique({
                where: {
                    email: loginUserDto.email
                }
            })

            if (!existUser) throw new HttpException("User not found", HttpStatus.NOT_FOUND)
            
            const token = await this.jwtService.signAsync({
                id: existUser.id
            })

            return {
                token,
                err: null
            }
        } catch (err) {
            console.log(err)
            return {
                token: null,
                err: err.message
            }
        }
    }
}
