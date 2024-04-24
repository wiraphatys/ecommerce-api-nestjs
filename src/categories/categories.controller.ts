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
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
