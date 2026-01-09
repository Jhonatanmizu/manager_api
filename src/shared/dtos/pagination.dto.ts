import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  offset: number;
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @Max(50)
  limit: number;
}
