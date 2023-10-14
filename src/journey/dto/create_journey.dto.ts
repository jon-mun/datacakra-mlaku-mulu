import { IsDate, IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateJourneyDto {
  @IsNotEmpty()
  touristId: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @IsNotEmpty()
  @IsString()
  destination: string;

  @IsString()
  description: string | undefined;
}
