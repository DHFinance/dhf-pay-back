import { ApiProperty } from '@nestjs/swagger';

export class ReturnCancelledPaymentDto {
  @ApiProperty({
    default: 1,
  })
  id: number;

  @ApiProperty({
    default: '2022-04-29T09:38:39.239Z',
  })
  datetime: Date;

  @ApiProperty({
    default: '2500000000',
  })
  amount: string;

  @ApiProperty({
    default: 'Not_paid',
  })
  status: string;

  @ApiProperty({
    default: 'test comment',
  })
  comment: string;

  @ApiProperty({
    default: 1,
  })
  type: number;

  @ApiProperty({
    default: 'test text',
  })
  text: string;

  @ApiProperty({
    default: true,
  })
  cancelled: boolean;
}
