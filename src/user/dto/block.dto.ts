import { ApiProperty } from "@nestjs/swagger";

export class BlockUserDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  blocked: boolean
}
