import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getAllUsers() {
    const users = await this.prismaService.user.findMany({
      include: {
        tourist: true,
        employee: true,
      },
    });

    return users;
  }

  async getTourists() {
    const tourists = await this.prismaService.tourist.findMany({
      include: {
        user: true,
      },
    });

    return tourists;
  }

  async getEmployees() {
    const employees = await this.prismaService.employee.findMany({
      include: {
        user: true,
      },
    });

    return employees;
  }

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

  async updateTouristUser(updateUserDto: UpdateUserDto, id: string) {
    try {
      const result = await this.prismaService.tourist.update({
        where: { id: id },
        data: {
          user: {
            update: {
              ...updateUserDto,
            },
          },
        },
      });

      return result;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Credentials taken');
        }

        if (error.code === 'P2025') {
          throw new NotFoundException('Tourist not found');
        }
      }
      throw error;
    }
  }

  async deleteTouristUser(id: string) {
    try {
      const tourist = await this.prismaService.tourist.findUnique({
        where: { id: id },
      });

      if (!tourist) {
        throw new NotFoundException('Tourist not found');
      }

      // delete journeys correlated to tourist
      await this.prismaService.journey.deleteMany({
        where: { touristId: id },
      });

      await this.prismaService.tourist.delete({
        where: { id: id },
      });

      const result = await this.prismaService.user.delete({
        where: { id: tourist.userId },
      });

      return result;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Tourist not found');
        }
      }
      throw error;
    }
  }

  async getTouristByUserId(id: string) {
    const tourist = this.prismaService.tourist.findUnique({
      where: { userId: id },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    return tourist;
  }

  async getEmployeeByUserId(id: string) {
    const employee = this.prismaService.employee.findUnique({
      where: { userId: id },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    return employee;
  }
}
