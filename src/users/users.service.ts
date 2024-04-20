import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { Address, User } from '@prisma/client';
import * as bcrypt from 'bcrypt'
import { AddressDto } from './dto/address.dto';


@Injectable()
export class UsersService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) { }
  async createUser(createUserDto: CreateUserDto): Promise<{user: User, err: string}> {
    try {
      // hashing password
      const hashedPassword: string = await bcrypt.hash(createUserDto.password, 10)
      createUserDto.password = hashedPassword

      // executing create user to database
      const user = await this.databaseService.user.create({
        data: createUserDto
      })

      return {
        user: user,
        err: null
      }
    } catch (err) {
      let message = "An error occurred while processing your request.";

      if (err.code === "P2002" && err.meta?.target?.includes("email")) {
        message = "This email address is already registered."
      }

      console.log("Error: ", err)
      return {
        user: null,
        err: message
      }
    }
  }

  async addAddress(addressDto: AddressDto): Promise<{address: Address, err: string}> {
    try {
      const address = await this.databaseService.address.create({
        data: addressDto
      })

      return {
        address: address,
        err: null
      }
    } catch (err) {
      let message = err.message

      if (err.code === "P2002" && err.meta?.target?.includes("userId")) {
        message = "This user already has address."
      }
      console.log("Error: ", err)

      return {
        address: null,
        err: message
      }
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
