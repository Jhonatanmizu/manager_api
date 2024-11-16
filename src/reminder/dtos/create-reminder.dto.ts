import { IsNotEmpty, MinLength, IsString, MaxLength } from 'class-validator';

export class CreateReminderDto {
  @IsNotEmpty()
  @MinLength(2)
  @IsString()
  @MaxLength(255)
  readonly description: string;

  @MinLength(2)
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  readonly from: string;

  @MinLength(2)
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  readonly to: string;
}
