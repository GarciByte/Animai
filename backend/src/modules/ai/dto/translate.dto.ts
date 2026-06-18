import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export enum TranslationContext {
  GENERIC = 'GENERIC',
  ANIME_DESCRIPTION = 'ANIME_DESCRIPTION',
  CHARACTER_DESCRIPTION = 'CHARACTER_DESCRIPTION',
}

export class TranslateAnimeContextDto {
  @ApiProperty({ description: 'Título del anime al que pertenece el texto' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  genres?: string[];

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  format?: string | null;

  @ApiPropertyOptional({
    type: [String],
    description: 'Nombres de tags relevantes',
  })
  @IsOptional()
  tags?: string[];
}

export class TranslateCharacterContextDto {
  @ApiProperty({
    description: 'Nombre del personaje al que pertenece el texto',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  animeName?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  gender?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  age?: string | null;
}

export class TranslateDto {
  @ApiProperty({ description: 'Texto en inglés a traducir al español' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  text: string;

  @ApiPropertyOptional({
    enum: TranslationContext,
    default: TranslationContext.GENERIC,
  })
  @IsOptional()
  @IsEnum(TranslationContext)
  context?: TranslationContext;

  @ApiPropertyOptional({ type: TranslateAnimeContextDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => TranslateAnimeContextDto)
  animeContext?: TranslateAnimeContextDto;

  @ApiPropertyOptional({ type: TranslateCharacterContextDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => TranslateCharacterContextDto)
  characterContext?: TranslateCharacterContextDto;
}
