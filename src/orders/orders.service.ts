import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from '@prisma/client';

@Injectable()
export class OrdersService {
  async InsertOrder(createOrderDto: CreateOrderDto): Promise<{ order: Order, err: string }> {
    try {

    } catch (err) {
      console.log("Error: ", err)
      return {
        order: null,
        err
      }
    }
  }

  async FindAllOrders(): Promise<{ orders: Order[], err: string }> {
    try {

    } catch (err) {
      console.log("Error: ", err)
      return {
        orders: null,
        err
      }
    }
  }

  async FindOrderById(id: number): Promise<{ order: Order, err: string }> {
    try {

    } catch (err) {
      console.log("Error: ", err)
      return {
        order: null,
        err
      }
    }  
  }

  async DeleteOrderById(id: number): Promise<{ err: string }> {
    try {

    } catch (err) {
      console.log("Error: ", err)
      return {
        err
      }
    }  
  }
}
