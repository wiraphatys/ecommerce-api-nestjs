import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, Redirect, Query } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { query, Response } from 'express';
import { Cart } from '@prisma/client';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  async create(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createCartDto: CreateCartDto
  ) {
    createCartDto.userId = req['user'].id;
    const { item, err } = await this.cartsService.InsertItemToCart(createCartDto);
    if (err !== null) {
      return res.status(500).json({
        success: false,
        message: err
      })
    }

    return res.status(201).json({
      success: true,
      data: item
    })
  }

  @Get()
  async GetAllCarts(
    @Req() req: Request,
    @Res() res: Response,
    @Query('uid') uid: string
  ) {
    let items: Cart[]
    let err: string
    
    const userRole = req['user'].roleId;

    switch (userRole) {
      case 1:
        if (uid === undefined) {
          err = "query params uid cannot be null"
          break;
        }
        ({ items, err } = await this.cartsService.FindAllUsersCart(parseInt(uid)));
        break;
      case 2:
        ({ items, err } = await this.cartsService.FindOwnCart(req['user'].id));
        break;
      default:
        err = "invalid user role"
    }
    if (err !== null) {
      let statusCode: number = 500;

      if (err === "invalid user role" || "query params uid cannot be null") statusCode = 400

      return res.status(statusCode).json({
        success: false,
        message: err
      })
    }

    return res.status(200).json({
      success: true,
      amount: items.length,
      data: items
    })
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartsService.update(+id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartsService.remove(+id);
  }
}
