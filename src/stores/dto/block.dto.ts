import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class BlockStoreDto {
  @ApiProperty({
    description: 'The id of the user whose lock status is being changed',
    default: 1,
  })
  id: number;
}

export class ReturnBlockStoreDto {
  @ApiProperty({
    default: 1,
  })
  id: number;

  @ApiProperty({
    default: 'test url',
  })
  url: string;

  @ApiProperty({
    default: 'test name',
  })
  name: string;

  @ApiProperty({
    default: 'description',
  })
  description: string;

  @ApiProperty({
    default: '9c91OXwkRUvKNK5gWn37dMuoVgdXM9ZRuTzE',
  })
  apiKey: string;

  @ApiProperty({
    description: 'Block status (false/true)',
    default: true,
  })
  blocked: boolean;
}
