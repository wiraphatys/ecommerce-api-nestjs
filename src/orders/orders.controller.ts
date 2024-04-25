import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Response } from 'express';
import { CreateOrderDataDto } from './dto/create-orderData.dto';

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
  async FindAllOrders() {
    const { orders, err } = await this.ordersService.FindAllOrders();
  }

  @Get(':id')
  async FindOrderById(@Param('id') id: string) {
    const { order, err } = await this.ordersService.FindOrderById(+id);
  }

  @Delete(':id')
  async DeleteOrderById(@Param('id') id: string) {
    const { err } = await this.ordersService.DeleteOrderById(+id);
  }
}
