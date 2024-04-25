import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request, Response } from 'express';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('register')
  async CreateUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response
  ) {
    const { user, err } = await this.usersService.InsertUser(createUserDto)
    if (err !== null) {
      return res.status(500).json({
        success: false,
        message: err
      })
    } else {
      return res.status(201).json({
        success: true,
        data: user
      })
    }
  }

  @Post('address')
  async CreateAddress(
    @Body() addressDto: CreateAddressDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    addressDto.userId = req['user'].id

    const { address, err } = await this.usersService.InsertAddress(addressDto)
    if (err !== null) {
      return res.status(500).json({
        success: false,
        message: err
      })
    } else {
      return res.status(201).json({
        success: true,
        data: address
      })
    }
  }

  @Get('me')
  async GetProfile(
    @Req() req: Request,
    @Res() res: Response
  ) {
    const { user, err } = await this.usersService.FindUserProfile(req['user'].id)
    if (err !== null) {
      return res.status(400).json({
        success: false,
        message: err
      })
    } else {
      return res.status(200).json({
        success: true,
        data: user
      })
    }
  }

  @Get()
  async GetAllUsers(@Res() res: Response) {
    const { users, err } = await this.usersService.FindAllUsers();
    if (err !== null) {
      switch (err) {
        case "not found any user":
          return res.status(404).json({
            success: false,
            message: err,
            data: []
          })
        default:
          return res.status(500).json({
            success: false,
            message: err,
          })
      }
    } else {
      return res.status(200).json({
        success: true,
        amount: users.length,
        data: users
      })
    }
  }

  @Patch(':id')
  async UpdateUserById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto
  ) {
    const { user, err } = await this.usersService.UpdateUserById(+id, updateUserDto, req);
    if (err !== null) {
      let statusCode: number;
      switch (err) {
        case "not found this user":
          statusCode = 404;
          break;
        case "you are not authorized to access this user":
          statusCode = 401;
          break;
        default:
          statusCode = 500;
      }

      return res.status(statusCode).json({
        success: false,
        message: err
      })
    } else {
      return res.status(200).json({
        success: true,
        data: user
      })
    }
  }

  @Delete(':id')
  async DeleteUserById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string
  ) {
    const { err } = await this.usersService.DeleteUserById(+id, req);
    if (err !== null) {
      let statusCode: number;
      switch (err) {
        case "not found this user":
          statusCode = 404;
          break;
        case "you are not authorized to access this user":
          statusCode = 401;
          break;
        default:
          statusCode = 500;
      }

      return res.status(statusCode).json({
        success: false,
        message: err
      })
    } else {
      return res.status(200).json({
        success: true,
        data: {}
      })
    }
  }

  @Patch('address/:id')
  async UpdateAddressById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto
  ) {
    const { address, err } = await this.usersService.UpdateAddressById(+id, updateAddressDto, req)
    if (err !== null) {
      let statusCode: number;
      switch (err) {
        case "not found this address" || "you have never added your address before, add now !":
          statusCode = 404;
          break;
        case "you are not authorized to access this address":
          statusCode = 401;
          break;
        default:
          statusCode = 500;
      }

      return res.status(statusCode).json({
        success: false,
        message: err
      })
    } else {
      return res.status(200).json({
        success: true,
        data: address
      })
    }
  }

  @Delete('address/:id')
  async DeleteAddressById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string
  ) {
    const { err } = await this.usersService.DeleteAddressById(+id, req);
    if (err !== null) {
      let statusCode: number;
      switch (err) {
        case "not found this address" || "you have never added your address before, add now !":
          statusCode = 404;
          break;
        case "you are not authorized to access this address":
          statusCode = 401;
          break;
        default:
          statusCode = 500;
      }

      return res.status(statusCode).json({
        success: false,
        message: err
      })
    } else {
      return res.status(200).json({
        success: true,
        data: {}
      })
    }
  }
}
