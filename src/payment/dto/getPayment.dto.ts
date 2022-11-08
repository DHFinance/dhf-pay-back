import { ApiProperty } from '@nestjs/swagger';

export class GetPaymentDto {
  @ApiProperty({
    default: 1,
  })
  id: number;
}
