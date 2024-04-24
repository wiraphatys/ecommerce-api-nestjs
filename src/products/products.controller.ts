import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Request, Response } from 'express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async CreateProduct(
    @Res() res: Response,
    @Body() createProductDto: CreateProductDto
  ) {
    const { product, err } = await this.productsService.InsertProduct(createProductDto)
    if (err !== null) {
      return res.status(500).json({
        success: false,
        message: err
      })
    } 
    
    return res.status(201).json({
      success: true,
      data: product
    })
  }

  @Get()
  async GetAllProducts(
    @Res() res: Response,
  ) {
    const { products, err} = await this.productsService.FindAllProducts();
    if (err !== null) {
      return res.status(500).json({
        success: false,
        message: err
      })
    }

    return res.status(200).json({
      success: true,
      amount: products.length,
      data: products
    })
  }

  @Get(':id')
  async FindProductById(
    @Res() res: Response,
    @Param('id') id: string
  ) {
    const { product, err } = await this.productsService.FindProductById(+id);
    if (err !== null) {
      let statusCode: number
      switch (err) {
        case "not found this product":
          statusCode = 404
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
      data: product
    })
  }

  @Patch(':id')
  async UpdateProductById(
    @Res() res: Response,
    @Param('id') id: string, 
    @Body() updateProductDto: UpdateProductDto
  ) {
    const { product, err } = await this.productsService.UpdateProductById(+id, updateProductDto);
    if (err !== null) {
      let statusCode: number
      switch (err) {
        case "not found this product":
          statusCode = 404
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
      data: product
    })
  }

  @Delete(':id')
  async DeleteProductById(
    @Param('id') id: string
  ) {
    const {} = await this.productsService.DeleteProductById(+id);
  }
}
