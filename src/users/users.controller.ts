import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request, Response } from 'express';
import { AddressDto } from './dto/address.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('register')
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response
  ) {
    const { user, err } = await this.usersService.createUser(createUserDto)
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
  async addAddress(
    @Body() addressDto: AddressDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    addressDto.userId = req['user'].id

    const { address, err } = await this.usersService.addAddress(addressDto)
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
  async getProfile(
    @Req() req: Request,
    @Res() res: Response
  ) {
    const { user, err } = await this.usersService.getProfile(req['user'].id)
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
  async findAll(@Res() res: Response) {
    const { users, err } = await this.usersService.findAll();
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
  async updateUserById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto
  ) {
    const { user, err } = await this.usersService.updateUserById(+id, updateUserDto, req);
    if (err !== null) {
      let statusCode: number;
      switch (err) {
        case "not found this user":
          statusCode = 404;
        case "you are not authorized to access this user":
          statusCode = 401;
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
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
