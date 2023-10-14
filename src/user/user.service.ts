import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      include: {
        tourist: true,
        employee: true,
      },
    });

    return users;
  }

  async getTourists() {
    const tourists = await this.prisma.tourist.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return tourists;
  }

  async getEmployees() {
    const employees = await this.prisma.employee.findMany({
      include: {
        user: true,
      },
    });

    return employees;
  }

  async createTouristUser(CreateUserDto: CreateUserDto) {
    const hashedPassword = await argon.hash(CreateUserDto.password);

    const data = {
      ...CreateUserDto,
      password: hashedPassword,
    };

    try {
      const user = await this.prisma.user.create({
        data: {
          ...data,
          role: 'TOURIST',
        },
      });

      const tourist = await this.prisma.tourist.create({
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
    const hashedPassword = await argon.hash(CreateUserDto.password);

    const data = {
      ...CreateUserDto,
      password: hashedPassword,
    };

    try {
      const user = await this.prisma.user.create({
        data: {
          ...data,
          role: 'EMPLOYEE',
        },
      });

      const employee = await this.prisma.employee.create({
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
      if (updateUserDto.password) {
        const hashedPassword = await argon.hash(updateUserDto.password);
        updateUserDto.password = hashedPassword;
      }

      const result = await this.prisma.tourist.update({
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
      const tourist = await this.prisma.tourist.findUnique({
        where: { id: id },
      });

      if (!tourist) {
        throw new NotFoundException('Tourist not found');
      }

      // delete journeys correlated to tourist
      await this.prisma.journey.deleteMany({
        where: { touristId: id },
      });

      await this.prisma.tourist.delete({
        where: { id: id },
      });

      const result = await this.prisma.user.delete({
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
    const tourist = this.prisma.tourist.findUnique({
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
    const employee = await this.prisma.employee.findUnique({
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
