import { IsDate, IsDateString, IsString } from 'class-validator';

export class UpdateJourneyDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  destination: string;

  @IsString()
  description: string;
}
