import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsDateString()
  publication_date: Date;

  @IsString()
  gender?: string;
}
