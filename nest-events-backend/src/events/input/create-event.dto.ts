import { IsDateString, IsString, Length } from 'class-validator';

export class CreateEventDto {
  @Length(5, 255)
  @IsString()
  name: string;

  description: string;

  @IsDateString()
  when?: string;

  @Length(5, 255)
  address: string;
}
