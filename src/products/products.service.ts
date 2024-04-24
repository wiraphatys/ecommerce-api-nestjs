import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ProductsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async InsertProduct(createProductDto: CreateProductDto): Promise<{ product: Product, err: string }> {
    try {
      const product = await this.databaseService.product.create({
        data: createProductDto
      })

      return {
        product,
        err: null
      }
    } catch (err) {
      console.log("Error: ", err)
      return {
        product: null,
        err: err.message
      }
    }
  }

  async FindAllProducts(): Promise<{ products: Product[], err: string }> {
    try {
      const products = await this.databaseService.product.findMany({
        include: {
          category: true
        }
      })

      return {
        products,
        err: null
      }
    } catch (err) {
      console.log("Error: ", err)
      return {
        products: null,
        err: err.message
      }
    }
  }

  async FindProductById(id: number): Promise<{ product: Product, err: string }> {
    try {
      const product = await this.databaseService.product.findUnique({
        where: {
          id
        },
        include: {
          category: true
        }
      })

      if (!product) {
        return {
          product: null,
          err: "not found this product"
        }
      }

      return {
        product,
        err: null
      }
    } catch (err) {
      console.log("Error: ", err)
      return {
        product: null,
        err: err.message
      }
    }  
  }

  async UpdateProductById(id: number, updateProductDto: UpdateProductDto): Promise<{ product: Product, err: string }> {
    try {
      const existed = await this.databaseService.product.findUnique({
        where: {
          id
        }
      })

      if (!existed) {
        return {
          product: null,
          err: "not found this product"
        }
      }

      const product = await this.databaseService.product.update({
        where: {
          id
        },
        data: updateProductDto
      })

      return {
        product,
        err: null
      }

    } catch (err) {
      console.log("Error: ", err)
      return {
        product: null,
        err: err.message
      }
    }  
  }

  async DeleteProductById(id: number): Promise<{ err: string }> {
    try {

    } catch (err) {
      console.log("Error: ", err)
      return {
        err: err.message
      }
    }  
  }
}
