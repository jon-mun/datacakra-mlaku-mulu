import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JourneyService } from './journey.service';
import { Role } from '@prisma/client';
import { GetUser, Roles } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { CreateJourneyDto, UpdateJourneyDto } from './dto';
import { TouristPrivateGuard } from 'src/auth/guard/tourist_private.guard';
import { UserService } from 'src/user/user.service';

@UseGuards(JwtGuard, RolesGuard)
@Controller('journeys')
export class JourneyController {
  constructor(
    private journeyService: JourneyService,
    private userService: UserService,
  ) {}

  @Get()
  @Roles(Role.ROOT, Role.EMPLOYEE)
  async getJourneys() {
    return this.journeyService.getJourneys();
  }

  @Get(':id')
  @Roles(Role.ROOT, Role.EMPLOYEE)
  async getJourneyById(@Param('id') id: string) {
    return this.journeyService.getJourneyById(id);
  }

  @Get('tourist/:id')
  @UseGuards(TouristPrivateGuard)
  @Roles(Role.TOURIST, Role.ROOT, Role.EMPLOYEE)
  async getJourneyByTouristId(@Param('id') id: string) {
    return this.journeyService.getJourneyByTouristId(id);
  }

  @Post()
  @Roles(Role.ROOT, Role.EMPLOYEE)
  async createJourney(
    @Body() createJourneyDto: CreateJourneyDto,
    @GetUser('sub') userId: string,
  ) {
    const employee = await this.userService.getEmployeeByUserId(userId);
    return this.journeyService.createJourney(createJourneyDto, employee.id);
  }

  @Put(':id')
  @Roles(Role.ROOT, Role.EMPLOYEE)
  async updateJourney(
    @Param('id') id: string,
    @Body() updateJourneyDto: UpdateJourneyDto,
  ) {
    return this.journeyService.updateJourney(id, updateJourneyDto);
  }

  @Delete(':id')
  @Roles(Role.ROOT, Role.EMPLOYEE)
  async deleteJourney(@Param('id') id: string) {
    return this.journeyService.deleteJourney(id);
  }
}
