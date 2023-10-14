import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
