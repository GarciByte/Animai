import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CharacterDto } from './character.dto';

export class ChatMessageDto {
  @ApiProperty({ enum: ['user', 'assistant'] })
  @IsIn(['user', 'assistant'])
  role: 'user' | 'assistant';

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
  content: string;
}

export class ChatDto {
  @ApiProperty({ type: CharacterDto })
  @ValidateNested()
  @Type(() => CharacterDto)
  character: CharacterDto;

  @ApiProperty({
    type: [ChatMessageDto],
    description:
      'Historial completo de la conversación, incluyendo el nuevo mensaje del usuario al final',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(30)
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  messages: ChatMessageDto[];
}
