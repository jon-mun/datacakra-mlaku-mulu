import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async createTouristUser(CreateUserDto: CreateUserDto) {
    try {
      const user = await this.prismaService.user.create({
        data: {
          ...CreateUserDto,
          role: 'TOURIST',
        },
      });

      const tourist = await this.prismaService.tourist.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return tourist;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async createEmployeeUser(CreateUserDto: CreateUserDto) {
    try {
      const user = await this.prismaService.user.create({
        data: {
          ...CreateUserDto,
          role: 'EMPLOYEE',
        },
      });

      const employee = await this.prismaService.employee.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return employee;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Credentials taken');
        }
      }
      throw error;
    }
  }
}
