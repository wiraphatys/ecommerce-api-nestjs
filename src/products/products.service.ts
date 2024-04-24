import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  async InsertProduct(createProductDto: CreateProductDto): Promise<{ product: Product, err: string }> {
    try {

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
