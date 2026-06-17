import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export enum QuickFilter {
  TRENDING = 'TRENDING',
  TOP_ANIME = 'TOP_ANIME',
  CURRENT_SEASON = 'CURRENT_SEASON',
  TOP_AIRING = 'TOP_AIRING',
  TOP_UPCOMING = 'TOP_UPCOMING',
}

export enum AnimeSort {
  TRENDING_DESC = 'TRENDING_DESC',
  POPULARITY_DESC = 'POPULARITY_DESC',
  SCORE_DESC = 'SCORE_DESC',
  FAVOURITES_DESC = 'FAVOURITES_DESC',
  TITLE_ROMAJI = 'TITLE_ROMAJI',
  START_DATE_DESC = 'START_DATE_DESC',
}

export enum AnimeSeason {
  WINTER = 'WINTER',
  SPRING = 'SPRING',
  SUMMER = 'SUMMER',
  FALL = 'FALL',
}

export enum AnimeFormat {
  TV = 'TV',
  TV_SHORT = 'TV_SHORT',
  MOVIE = 'MOVIE',
  SPECIAL = 'SPECIAL',
  OVA = 'OVA',
  ONA = 'ONA',
  MUSIC = 'MUSIC',
}

export enum AnimeStatus {
  FINISHED = 'FINISHED',
  RELEASING = 'RELEASING',
  NOT_YET_RELEASED = 'NOT_YET_RELEASED',
  CANCELLED = 'CANCELLED',
  HIATUS = 'HIATUS',
}

export class SearchAnimeDto {
  @ApiPropertyOptional({ description: 'Búsqueda por nombre' })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional({
    enum: QuickFilter,
    description: 'Vista rápida predefinida',
  })
  @IsOptional()
  @IsEnum(QuickFilter)
  quickFilter?: QuickFilter;

  @ApiPropertyOptional({
    enum: AnimeSort,
    description: 'Criterio de ordenación',
  })
  @IsOptional()
  @IsEnum(AnimeSort)
  sort?: AnimeSort;

  @ApiPropertyOptional({ enum: AnimeSeason })
  @IsOptional()
  @IsEnum(AnimeSeason)
  season?: AnimeSeason;

  @ApiPropertyOptional({ type: Number, description: 'Año de la temporada' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @Max(2200)
  seasonYear?: number;

  @ApiPropertyOptional({ enum: AnimeFormat, isArray: true })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    Array.isArray(value) ? (value as unknown[]) : [value],
  )
  @IsArray()
  @IsEnum(AnimeFormat, { each: true })
  formats?: AnimeFormat[];

  @ApiPropertyOptional({ enum: AnimeStatus, isArray: true })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    Array.isArray(value) ? (value as unknown[]) : [value],
  )
  @IsArray()
  @IsEnum(AnimeStatus, { each: true })
  statuses?: AnimeStatus[];

  @ApiPropertyOptional({
    type: [String],
    description: 'Géneros (Action, Comedy, Drama…)',
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    Array.isArray(value) ? (value as unknown[]) : [value],
  )
  @IsArray()
  @IsString({ each: true })
  genres?: string[];

  @ApiPropertyOptional({ type: Number, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ type: Number, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  perPage?: number;
}
