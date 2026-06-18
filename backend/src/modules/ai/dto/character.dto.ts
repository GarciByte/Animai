import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CharacterDto {
  @ApiProperty({
    description: 'Nombre del personaje que la IA debe interpretar',
  })
  @IsString()
  @MaxLength(150)
  characterName: string;

  @ApiProperty({
    description: 'Nombre del anime al que pertenece el personaje',
  })
  @IsString()
  @MaxLength(150)
  animeName: string;

  @ApiProperty({
    description: 'Descripción de personalidad usada para mantener el papel',
  })
  @IsString()
  @MaxLength(2000)
  characterDescription: string;

  @ApiPropertyOptional({
    description:
      'URL de la imagen del personaje (informativo, no se usa en el prompt)',
  })
  @IsOptional()
  @IsString()
  image?: string;
}
