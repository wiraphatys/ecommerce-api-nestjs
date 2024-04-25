import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOrderLineDto } from './dto/create-orderLine.dto';
import { Order, OrderLine } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateOrderDataDto } from './dto/create-orderData.dto';
import * as uuid from 'uuid'

@Injectable()
export class OrdersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async InsertOrderWithLines(createOrderDataDto: CreateOrderDataDto): Promise<{ order: Order, err: string }> {
    try {
      return this.databaseService.$transaction(async (prisma) => {
        const createOrderDto = {
          id: uuid.v4(),
          userId: createOrderDataDto.userId
        }

        const order = await prisma.order.create({ 
          data: createOrderDto
        })

        const orderLines: CreateOrderLineDto[] = createOrderDataDto.items.map(item => ({
          ...item,
          orderId: order.id
        }))

        await prisma.orderLine.createMany({ data: orderLines })

        const createdOrder = await prisma.order.findUnique({
          where: {
            id: order.id
          },
          include: {
            orderLines: true
          }
        })

        return { 
          order: createdOrder, 
          err: null 
        }
      })
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
      const orders = await this.databaseService.order.findMany({
        include: {
          orderLines: true
        }
      })

      return {
        orders,
        err: null
      }
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
