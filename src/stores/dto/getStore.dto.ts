import { ApiProperty } from '@nestjs/swagger';

export class GetStoreDto {
  @ApiProperty({
    default: 1,
  })
  id: number;
}
