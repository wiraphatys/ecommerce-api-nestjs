import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res() res: Response
  ) {
    const { token, err } = await this.authService.login(loginUserDto)
    if (token) {
      res.cookie('access_token', token, { httpOnly: true });
      return res.status(200).json({
        success: true,
        message: "logged in successfully."
      })
    } else {
      return res.status(err === "User not found" ? 404 : 400).json({
        success: false,
        message: err
      })
    } 
  }

  @Post('logout')
  async logout(
    @Res() res: Response
  ) {
    res.cookie('access_token', 'expired', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    })

    return res.status(200).json({
      success: true,
      message: "logged out successfully."
    })
  }
}
