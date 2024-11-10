import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateReminderDto {
  @IsNotEmpty()
  @MinLength(5)
  readonly description: string;
  @IsNotEmpty()
  readonly from: string;
  @IsNotEmpty()
  readonly to: string;
}
