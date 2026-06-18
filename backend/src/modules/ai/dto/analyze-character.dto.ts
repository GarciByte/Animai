import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CharacterDto } from './character.dto';
import { FuzzyDateDto } from './common.dto';

export class CharacterAppearanceDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsInt()
  year?: number | null;

  @ApiProperty()
  @IsString()
  role: string;
}

export class AnalyzeCharacterDataDto {
  @ApiProperty({
    description: 'AniList character ID, usado como parte de la clave de caché',
  })
  @IsInt()
  id: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  nativeName?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  age?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  gender?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  bloodType?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  height?: string | null;

  @ApiPropertyOptional({ type: FuzzyDateDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FuzzyDateDto)
  birthday?: FuzzyDateDto;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsInt()
  favourites?: number | null;

  @ApiPropertyOptional({ type: [CharacterAppearanceDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CharacterAppearanceDto)
  mediaMain?: CharacterAppearanceDto[];

  @ApiPropertyOptional({ type: [CharacterAppearanceDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CharacterAppearanceDto)
  mediaSupporting?: CharacterAppearanceDto[];
}

export class AnalyzeCharacterDto {
  @ApiProperty({
    type: CharacterDto,
    description: 'El personaje que interpreta la IA (quién habla)',
  })
  @ValidateNested()
  @Type(() => CharacterDto)
  character: CharacterDto;

  @ApiProperty({
    type: AnalyzeCharacterDataDto,
    description: 'El personaje sobre el que se pide opinión',
  })
  @ValidateNested()
  @Type(() => AnalyzeCharacterDataDto)
  targetCharacter: AnalyzeCharacterDataDto;
}
