import { Module } from '@nestjs/common';
import { JourneyController } from './journey.controller';
import { JourneyService } from './journey.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [JourneyController],
  providers: [JourneyService, UserService],
})
export class JourneyModule {}
