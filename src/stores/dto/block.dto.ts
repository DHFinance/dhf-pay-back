import { ApiProperty } from "@nestjs/swagger";

export class BlockStoreDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  blocked: boolean
}
