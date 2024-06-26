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

  async FindCategoryById(id: number): Promise<{ category: ProductCategory, err: string }> {
    try {
      const category = await this.databaseService.productCategory.findUnique({
        where: {
          id
        }
      })

      if (!category) {
        return {
          category: null,
          err: "not found this category"
        }
      }

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

  async UpdateCategoryById(id: number, updateCategoryDto: UpdateCategoryDto): Promise<{ category: ProductCategory, err: string }> {
    try {
      const existed = await this.databaseService.productCategory.findUnique({
        where: {
          id
        }
      })

      if (!existed) {
        return {
          category: null,
          err: "not found this category"
        }
      }

      const category = await this.databaseService.productCategory.update({
        where: {
          id
        },
        data: updateCategoryDto
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

  async DeleteCategoryById(id: number): Promise<{ err: string }> {
    try {
      const existed = await this.databaseService.productCategory.findUnique({
        where: {
          id
        }
      })

      if (!existed) {
        return {
          err: "not found this category"
        }
      }

      await this.databaseService.productCategory.delete({
        where: { 
          id
        }
      })

      return {
        err: null
      }
    } catch (err) {
      console.log("Error: ", err)
      return {
        err: err.message
      }
    }
  }
}
