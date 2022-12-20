import { ApiProperty } from '@nestjs/swagger';

export class BlockUserDto {
  @ApiProperty({
    description: 'The id of the user whose lock status is being changed',
    default: 1,
  })
  id: number;
  @ApiProperty({
    description: 'Block status (false/true)',
    default: true,
  })
  blocked: boolean;
}
