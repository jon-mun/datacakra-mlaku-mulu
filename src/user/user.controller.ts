import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { JwtGuard } from 'src/auth/guard';
import { Roles } from 'src/auth/decorator';

import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Role } from 'src/auth/types';

@UseGuards(JwtGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // Tourists
  @Post('tourists')
  @Roles(Role.ROOT, Role.EMPLOYEE) // Employee Procedure
  async createTouristUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createTouristUser(createUserDto);
  }

  @Get('tourists')
  @Roles(Role.ROOT, Role.EMPLOYEE) // Employee Procedure
  async getTourists() {
    return this.userService.getTourists();
  }

  @Patch('tourists/:id')
  @Roles(Role.ROOT, Role.EMPLOYEE) // Root Procedure
  async updateTourist(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') id: string,
  ) {
    return this.userService.updateTouristUser(updateUserDto, id);
  }

  @Delete('tourists/:id')
  @Roles(Role.ROOT, Role.EMPLOYEE) // Root Procedure
  async deleteTourist(@Param('id') id: string) {
    return this.userService.deleteTouristUser(id);
  }

  // Employees
  @Post('employees')
  @Roles(Role.ROOT) // Root Procedure
  async createEmployeeUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createEmployeeUser(createUserDto);
  }

  @Get()
  @Roles(Role.ROOT) // Root Procedure
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('employees')
  @Roles(Role.ROOT) // Root Procedure
  async getEmployees() {
    return this.userService.getEmployees();
  }
}
