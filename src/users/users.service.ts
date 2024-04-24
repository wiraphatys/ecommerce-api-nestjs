import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { Address, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs'
import { CreateAddressDto } from './dto/create-address.dto';
import { Request } from 'express';
import { UpdateAddressDto } from './dto/update-address.dto';


@Injectable()
export class UsersService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) { }
  async InsertUser(createUserDto: CreateUserDto): Promise<{ user: User, err: string }> {
    try {
      // hashing password
      const hashedPassword: string = await bcrypt.hash(createUserDto.password, 10)
      createUserDto.password = hashedPassword

      // executing create user to database
      const user = await this.databaseService.user.create({
        data: createUserDto
      })
      delete user.password

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

  async InsertAddress(addressDto: CreateAddressDto): Promise<{ address: Address, err: string }> {
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

  async FindUserProfile(userId: number): Promise<{ user: User, err: string }> {
    try {
      const user = await this.databaseService.user.findUnique({
        where: {
          id: userId
        },
        include: {
          address: true
        }
      })
      if (!user) {
        return {
          user: null,
          err: "not found this user"
        }
      }

      delete user.password

      return {
        user,
        err: null
      }
    } catch (err) {
      console.log(err)
      return {
        user: null,
        err: err
      }
    }
  }

  async FindAllUsers(): Promise<{ users: User[], err: string }> {
    try {
      const users = await this.databaseService.user.findMany();
      if (!users) {
        return {
          users: null,
          err: "not found any user"
        }
      }

      return {
        users,
        err: null
      }
    } catch (err) {
      console.log("Error: ", err);
      return {
        users: null,
        err: err
      }
    }
  }

  async UpdateUserById(id: number, updateUserDto: UpdateUserDto, req: Request): Promise<{ user: User, err: string }> {
    try {
      // check existed user
      const existed = await this.databaseService.user.findUnique({
        where: {
          id: id
        }
      })

      // role: admin
      if (req['user'].roleId === 1) {
        if (!existed) {
          return {
            user: null,
            err: "not found this user"
          }
        }

        if (updateUserDto.password)
          updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10)

        const user = await this.databaseService.user.update({
          where: {
            id
          },
          data: updateUserDto
        })
        delete user.password;

        return {
          user,
          err: null
        }
      }
      // role: user
      else if (req['user'].roleId === 2) {
        // ownership validation
        if (existed && req['user'].id === existed.id) {
          if (updateUserDto.password)
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10)

          const user = await this.databaseService.user.update({
            where: {
              id
            },
            data: updateUserDto
          })
          delete user.password;

          return {
            user,
            err: null
          }
        } else {
          return {
            user: null,
            err: "you are not authorized to access this user"
          }
        }
      }
    } catch (err) {
      console.log("Error: ", err)
      return {
        user: null,
        err: err.message
      }
    }
  }

  async DeleteUserById(id: number, req: Request): Promise<{ err: string }> {
    try {
      const existed = await this.databaseService.user.findUnique({
        where: {
          id
        }
      })

      // role: admin
      if (req['user'].roleId === 1) {
        if (!existed) {
          return {
            err: "not found this user"
          }
        }

        await this.databaseService.user.delete({
          where: {
            id
          }
        })

        return {
          err: null
        }

      }
      // role: user
      else if (req['user'].roleId === 2) {
        // ownership validation
        if (existed && req['user'].id === existed.id) {
          await this.databaseService.user.delete({
            where: {
              id
            }
          })

          return {
            err: null
          }
        } else {
          return {
            err: "you are not authorized to access this user"
          }
        }
      }
    } catch (err) {
      console.log("Error: ", err)
      return {
        err: err.message
      }
    }
  }

  async UpdateAddressById(id: number, updateAddressDto: UpdateAddressDto, req: Request): Promise<{ address: Address, err: string }> {
    try {
      const existed = await this.databaseService.address.findUnique({
        where: {
          userId: id
        }
      })

      // role: admin
      if (req['user'].roleId === 1) {
        if (!existed) {
          return {
            address: null,
            err: "not found this address"
          }
        }

        const address = await this.databaseService.address.update({
          where: {
            userId: id
          },
          data: updateAddressDto
        })

        return {
          address,
          err: null
        }
      }
      // role: user
      else if (req['user'].roleId === 2) {
        // ownership validation
        if (req['user'].id === id) {
          if (!existed) {
            return {
              address: null,
              err: "you have never added your address before, add now !"
            }
          }

          const address = await this.databaseService.address.update({
            where: {
              userId: id
            },
            data: updateAddressDto
          })

          return {
            address,
            err: null
          }
        } else {
          return {
            address: null,
            err: "you are not authorized to access this address"
          }
        }
      }
    } catch (err) {
      console.log("Error: ", err)
      return {
        address: null,
        err: err.message
      }
    }
  }

  async DeleteAddressById(id: number, req: Request): Promise<{ err: string }> {
    try {
      const existed = await this.databaseService.address.findUnique({
        where: {
          userId: id
        }
      })

      // role: admin
      if (req['user'].roleId === 1) {
        if (!existed) {
          return {
            err: "not found this address"
          }
        }

        await this.databaseService.address.delete({
          where: {
            userId: id
          }
        })

        return {
          err: null
        }
      }
      // role: user
      else if (req['user'].roleId === 2) {
        // ownership validation
        if (req['user'].id === id) {
          if (!existed) {
            return {
              err: "you have never added your address before, add now !"
            }
          }

          await this.databaseService.address.delete({
            where: {
              userId: id
            }
          })

          return {
            err: null
          }
        } else {
          return {
            err: "you are not authorized to access this address"
          }
        }
      }
    } catch (err) {
      console.log("Error: ", err)
      return {
        err
      }
    }
  }
}
