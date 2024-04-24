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
