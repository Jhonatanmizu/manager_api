import {
  IsNotEmpty,
  MinLength,
  IsString,
  MaxLength,
  IsUUID,
} from 'class-validator';

export class CreateReminderDto {
  @IsNotEmpty()
  @MinLength(2)
  @IsString()
  @MaxLength(255)
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  readonly from_id: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  readonly to_id: string;
}
