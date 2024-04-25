import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Response } from 'express';
import { CreateOrderDataDto } from './dto/create-orderData.dto';
import { Order } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async CreateOrder(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createOrderDataDto: CreateOrderDataDto
  ) {
    createOrderDataDto.userId = req['user'].id
    const { order, err} = await this.ordersService.InsertOrderWithLines(createOrderDataDto);
    if (err !== null) {
      return res.status(500).json({
        success: false,
        message: err
      })
    }

    return res.status(201).json({
      success: true,
      data: order
    })
  }

  @Get()
  async GetAllOrders(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    let orders: Order[]
    let err: string

    const userRole: number = req['user'].roleId

    switch (userRole) {
      case 1:
        ({ orders, err } = await this.ordersService.FindAllOrders())
        break;
      case 2:
        ({ orders, err } = await this.ordersService.FindOwnOrders(req['user'].id))
        break;
      default:
        err = "invalid user role"
    }

    if (err !== null) {
      return res.status(500).json({
        success: true,
        message: err
      })
    }

    return res.status(200).json({
      success: true,
      amount: orders.length,
      data: orders
    })
  }

  @Get(':id')
  async GetOrderById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string
  ) {
    const { order, err } = await this.ordersService.FindOrderById(id, req);
    if (err !== null) {
      let statusCode: number
      switch (err) {
        case "you are not authorized to access this order":
          statusCode = 401
          break;
        case "not found this order":
          statusCode = 404
          break;
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
      data: order
    })
  }

  @Delete(':id')
  async DeleteOrderById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string
  ) {
    const { err } = await this.ordersService.DeleteOrderById(id, req);
    if (err !== null) {
      let statusCode: number
      switch (err) {
        case "you are not authorized to access this order":
          statusCode = 401
          break;
        case "not found this order":
          statusCode = 404
          break;
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
      data: {}
    })
  }
}
