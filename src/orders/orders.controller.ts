import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async CreateOrder(@Body() createOrderDto: CreateOrderDto) {
    const { order, err} = await this.ordersService.InsertOrder(createOrderDto);
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
