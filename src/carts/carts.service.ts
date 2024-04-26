import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CartsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async InsertItemToCart(createCartDto: CreateCartDto): Promise<{ item: Cart, err: string }> {
    try {
      const item = await this.databaseService.cart.create({
        data: createCartDto,
        include: {
          product: true
        }
      })

      return {
        item,
        err: null
      }
    } catch (err) {
      console.log("Error: ", err)
      return {
        item: null,
        err: err.message
      }
    }
  }

  async FindAllUsersCart(userId: number): Promise<{ items: Cart[], err: string }> {
    try {
      const items = await this.databaseService.cart.findMany({
        where: {
          userId
        },
        include: {
          product: true
        }
      })

      return {
        items,
        err: null
      }
    } catch (err) {
      console.log("Error: ", err)
      return {
        items: null,
        err: err.message
      }
    }
  }

  async FindOwnCart(userId: number): Promise<{ items: Cart[], err: string }> {
    try {
      const items = await this.databaseService.cart.findMany({
        where: {
          userId
        },
        include: {
          product: true
        }
      })

      return {
        items,
        err: null
      }
    } catch (err) {
      console.log("Error: ", err)
      return {
        items: null,
        err: err.message
      }
    }
  }

  async FindCartItemById(productId: number, userId: number, req: Request): Promise<{ item: Cart, err: string }> {
    try {
      const cartItem = await this.databaseService.cart.findFirst({
        where: {
          productId,
          userId
        },
        include: {
          product: true
        }
      })

      // role: admin
      if (req['user'].roleId === 1) {
        if (!cartItem) {
          return {
            item: null,
            err: "not found this cart item"
          }
        }

        return {
          item: cartItem,
          err: null
        }
      } 
      // role: customer
      else if (req['user'].roleId === 2) {
        // ownership validation
        if (cartItem && req['user'].id === cartItem.userId) {
          return {
            item: cartItem,
            err: null
          }
        } else {
          return {
            item: null,
            err: "you are not authorized to access this cart item"
          }
        }
      }
    } catch (err) {
      console.log("Error: ", err)
      return {
        item: null,
        err: err.message
      }
    }
  }

  async UpdateCartItemById(productId: number, userId: number, req: Request, updateCartDto: UpdateCartDto): Promise<{ item: Cart, err: string }> {
    try {
      const existed = await this.databaseService.cart.findFirst({
        where: {
          productId,
          userId
        }
      })

      // role: admin
      if (req['user'].roleId === 1) {
        if (!existed) {
          return {
            item: null,
            err: "not found this cart item"
          }
        }

        const item = await this.databaseService.cart.update({
          where: {
            userId_productId: {
              userId: userId,
              productId: productId
            }
          },
          data: {
            quantity: updateCartDto.quantity
          }
        });

        return {
          item,
          err: null
        }
      } 
      // role: customer
      else if (req['user'].roleId === 2) {
        // ownership validation
        if (existed && req['user'].id === existed.userId) {
          const item = await this.databaseService.cart.update({
            where: {
              userId_productId: {
                userId: userId,
                productId: productId
              }
            },
            data: {
              quantity: updateCartDto.quantity
            }
          });

          return {
            item,
            err: null
          }
        } else {
          return {
            item: null,
            err: "you are not authorized to access this cart item"
          }
        }
      }
    } catch (err) {
      console.log("Error: ", err)
      return {
        item: null,
        err: err.message
      }
    }
  }

  async DeleteCartItemById(productId: number, userId: number, req: Request): Promise<{ err: string }> {
    try {
      const existed = await this.databaseService.cart.findFirst({
        where: {
          productId,
          userId
        }
      })

      // role: admin
      if (req['user'].roleId === 1) {
        if (!existed) {
          return {
            err: "not found this cart item"
          }
        }

        await this.databaseService.cart.delete({
          where: {
            userId_productId: {
              userId,
              productId
            }
          }
        })

        return {
          err: null
        }
      }
      // role: customer
      else if (req['user'].roleId === 2) {
        // ownership validation
        if (existed && req['user'].id === existed.userId) {
          await this.databaseService.cart.delete({
            where: {
              userId_productId: {
                userId,
                productId
              }
            }
          })

          return {
            err: null
          }
        } else {
          return {
            err: "you are not authorized to access this cart item"
          }
        }
      }
    } catch (err) {
      console.log("Error: ", err)
      return {
        err: err.message
      }
    }
  }
}
