import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsStrongPassword()
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(200)
  readonly name: string;

  @IsDate()
  readonly birthDate?: Date | null;
}
