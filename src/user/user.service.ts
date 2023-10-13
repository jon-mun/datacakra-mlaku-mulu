import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async createTouristUser(CreateUserDto: CreateUserDto) {
    return this.prismaService.user.create({
      data: {
        ...CreateUserDto,
        role: 'TOURIST',
      },
    });
  }

  async createEmployeeUser(CreateUserDto: CreateUserDto) {
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
  }
}
