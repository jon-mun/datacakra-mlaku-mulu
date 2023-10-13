import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // TODO: implement argon2 hashing
    if (user.password !== password) {
      throw new BadRequestException('Invalid password');
    }

    return user;
  }
}
