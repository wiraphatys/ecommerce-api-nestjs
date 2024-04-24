import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Response } from 'express';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async CreateCategory(
    @Res() res: Response,
    @Body() createCategoryDto: CreateCategoryDto
  ) {
    const { category, err } = await this.categoriesService.InsertCategory(createCategoryDto);
    if (err !== null) {
      return res.status(500).json({
        success: false,
        message: err
      })
    }

    return res.status(201).json({
      success: true,
      data: category
    })
  }

  @Get()
  async GetAllCategories(
    @Res() res: Response
  ) {
    const { categories, err } = await this.categoriesService.FindAllCategories();
    if (err !== null) {
      return res.status(500).json({
        success: false,
        message: err
      })
    }

    return res.status(200).json({
    success: true,
    amount: categories.length,
    data: categories
    })
  }

  @Get(':id')
  async GetCategoryById(
    @Res() res: Response,
    @Param('id') id: string
  ) {
    const { category, err } = await this.categoriesService.FindCategoryById(+id);
    if (err !== null) {
      let statusCode: number;
      switch (err) {
        case "not found this category":
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
      data: category
    })
  }

  @Patch(':id')
  async UpdateCategoryById(
    @Res() res: Response,
    @Param('id') id: string, 
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    const { category, err } = await this.categoriesService.UpdateCategoryById(+id, updateCategoryDto);
    if (err !== null) {
      let statusCode: number;
      switch (err) {
        case "not found this category":
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
      data: category
    })
  }

  @Delete(':id')
  async DeleteCategoryById(
    @Res() res: Response,
    @Param('id') id: string
  ) {
    const { err } = await this.categoriesService.DeleteCategoryById(+id);
    if (err !== null) {
      let statusCode: number;
      switch (err) {
        case "not found this category":
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
      data: {}
    })
  }
}
