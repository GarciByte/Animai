import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class FuzzyDateDto {
  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsInt()
  year?: number | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsInt()
  month?: number | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsInt()
  day?: number | null;
}
