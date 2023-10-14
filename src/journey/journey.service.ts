import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJourneyDto, UpdateJourneyDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class JourneyService {
  constructor(private prisma: PrismaService) {}

  async getJourneys() {
    return this.prisma.journey.findMany();
  }

  async getJourneyById(id: string) {
    return this.prisma.journey.findUnique({
      where: { id },
    });
  }

  async getJourneyByTouristId(id: string) {
    return this.prisma.journey.findMany({
      where: { touristId: id },
    });
  }

  async createJourney(data: CreateJourneyDto, employeeId: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
    });
    if (!employee) throw new BadRequestException('Employee not found');

    return this.prisma.journey.create({
      data: {
        startDate: data.startDate,
        endDate: data.endDate,
        destination: data.destination,
        employee: {
          connect: { id: employeeId },
        },
        tourist: {
          connect: { id: data.touristId },
        },
        description: data.description,
      },
    });
  }

  async updateJourney(id: string, data: UpdateJourneyDto) {
    if (!id) throw new BadRequestException('id is undefined');

    try {
      const result = await this.prisma.journey.update({
        where: { id: id },
        data,
      });

      return result;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException('Journey not found');
        }
      }
      throw error;
    }
  }

  async deleteJourney(id: string) {
    try {
      const result = await this.prisma.journey.delete({
        where: { id },
      });

      return result;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException('Journey not found');
        }
      }

      throw error;
    }
  }
}
