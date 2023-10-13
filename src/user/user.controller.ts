import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto';
import { JwtGuard } from 'src/auth/guard';
import { Roles } from 'src/auth/decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@UseGuards(JwtGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('tourists')
  @Roles(Role.ROOT, Role.EMPLOYEE) // Employee Procedure
  async createTouristUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createTouristUser(createUserDto);
  }

  @Post('employees')
  @Roles(Role.ROOT) // Root Procedure
  async createEmployeeUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createEmployeeUser(createUserDto);
  }
}
