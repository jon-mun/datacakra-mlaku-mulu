import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('tourist')
  //   Employee Procedure
  async createTouristUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createTouristUser(createUserDto);
  }

  @Post('employee')
  //   Root Procedure
  async createEmployeeUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createEmployeeUser(createUserDto);
  }
}
