import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ProductCategory } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async InsertCategory(createCategoryDto: CreateCategoryDto): Promise<{ category: ProductCategory, err: string }> {
    try {
      const category = await this.databaseService.productCategory.create({
        data: createCategoryDto
      })

      return {
        category,
        err: null
      }
    } catch (err) {
      console.log("Error: ", err)
      return {
        category: null,
        err: err.message
      }
    }
  }

  async FindAllCategories(): Promise<{ categories: ProductCategory[], err: string }> {
    try {
      const categories = await this.databaseService.productCategory.findMany()

      return {
        categories,
        err: null
      }
    } catch (err) {
      console.log("Error: ", err)
      return {
        categories: null,
        err: err.message
      }
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
