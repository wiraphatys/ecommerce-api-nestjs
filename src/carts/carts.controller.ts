import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, Query } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Response } from 'express';
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

  @Get(':productId')
  async GetCartItemById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('productId') productId: string,
    @Query('uid') uid: string
  ) {
    let userId: number;
    let statusCode = 400;

    const userRole = req['user'].roleId;
    switch (userRole) {
      case 1:
        if (uid === undefined) {
          break;
        }
        userId = +uid;
        break;
      case 2:
        userId = req['user'].id
        break;
      default:
        return res.status(statusCode).json({ success: false, message: "invalid user role"})

    }
    const { item, err } = await this.cartsService.FindCartItemById(+productId, userId, req)
    if (err !== null) {
      switch (err) {
        case "not found this cart item":
          statusCode = 404
          break
        case "you are not authorized to access this cart item":
          statusCode = 401
          break
        default:
          statusCode = 500
      }

      return res.status(statusCode).json({
        success: false,
        message: err
      })
    }

    return res.status(200).json({
      success: true,
      data: item
    })
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
