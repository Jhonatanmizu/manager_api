import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFileDto {
  @IsString()
  readonly key: string;

  @IsNotEmpty()
  @IsString()
  readonly filename: string;

  @IsInt()
  readonly size: number;

  @IsNotEmpty()
  @IsString()
  readonly mimeType: string;

  @IsNotEmpty()
  @IsString()
  readonly url: string;

  @IsDate()
  @IsOptional()
  readonly createdAt?: Date | null;

  @IsDate()
  @IsOptional()
  readonly updatedAt?: Date | null;

  @IsDate()
  @IsOptional()
  readonly deletedAt?: Date | null;
}
