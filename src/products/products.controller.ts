import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Request, Response } from 'express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  CreateProduct(
    @Res() res: Response,
    @Body() createProductDto: CreateProductDto
  ) {
    return this.productsService.InsertProduct(createProductDto);
  }

  @Get()
  GetAllProducts(
    @Res() res: Response,
  ) {
    return this.productsService.FindAllProducts();
  }

  @Get(':id')
  FindProductById(
    @Res() res: Response,
    @Param('id') id: string
  ) {
    return this.productsService.FindProductById(+id);
  }

  @Patch(':id')
  UpdateProductById(
    @Res() res: Response,
    @Param('id') id: string, 
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.UpdateProductById(+id, updateProductDto);
  }

  @Delete(':id')
  DeleteProductById(
    @Param('id') id: string
  ) {
    return this.productsService.DeleteProductById(+id);
  }
}
