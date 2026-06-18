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

export class TitleDto {
  @ApiProperty()
  @IsString()
  romaji: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  english?: string | null;
}

export class TagDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  category?: string | null;
}

export class StudioDto {
  @ApiProperty()
  @IsString()
  name: string;
}

export class CharacterRefDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  role: string;
}

export class RelationRefDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  relationType: string;
}

export class AnalyzeAnimeDataDto {
  @ApiProperty({
    description: 'AniList media ID, usado como parte de la clave de caché',
  })
  @IsInt()
  id: number;

  @ApiProperty({ type: TitleDto })
  @ValidateNested()
  @Type(() => TitleDto)
  title: TitleDto;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  format?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  status?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsInt()
  episodes?: number | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsInt()
  duration?: number | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  source?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  season?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsInt()
  seasonYear?: number | null;

  @ApiPropertyOptional({ type: FuzzyDateDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FuzzyDateDto)
  startDate?: FuzzyDateDto;

  @ApiPropertyOptional({ type: FuzzyDateDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FuzzyDateDto)
  endDate?: FuzzyDateDto;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  countryOfOrigin?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsInt()
  averageScore?: number | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsInt()
  meanScore?: number | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsInt()
  popularity?: number | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsInt()
  favourites?: number | null;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genres?: string[];

  @ApiPropertyOptional({ type: [TagDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagDto)
  tags?: TagDto[];

  @ApiPropertyOptional({ type: [StudioDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudioDto)
  studios?: StudioDto[];

  @ApiPropertyOptional({
    type: [CharacterRefDto],
    description:
      'Personajes del anime (nombre + rol), para dar contexto del reparto',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CharacterRefDto)
  characters?: CharacterRefDto[];

  @ApiPropertyOptional({
    type: [RelationRefDto],
    description: 'Animes relacionados (secuelas, precuelas, spin-offs…)',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RelationRefDto)
  relations?: RelationRefDto[];
}

export class AnalyzeAnimeDto {
  @ApiProperty({ type: CharacterDto })
  @ValidateNested()
  @Type(() => CharacterDto)
  character: CharacterDto;

  @ApiProperty({ type: AnalyzeAnimeDataDto })
  @ValidateNested()
  @Type(() => AnalyzeAnimeDataDto)
  anime: AnalyzeAnimeDataDto;
}
