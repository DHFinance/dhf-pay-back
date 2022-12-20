import { ApiProperty } from '@nestjs/swagger';

export class ReturnTransactionDto {
  @ApiProperty({
    default: 1,
  })
  id: number;

  @ApiProperty({
    default: 'Not_paid',
  })
  status: string;

  @ApiProperty({
    default: 'example@gmail.com',
  })
  email: string;

  @ApiProperty({
    default: 'b2abe9f421a6c8e8f331f734f863148561d5e8d1a4672d38bce1551e95a9c76b',
  })
  txHash: string;

  @ApiProperty({
    default: '2022-04-12 11:57:05.000',
  })
  updated: Date;

  @ApiProperty({
    default:
      '01fa50651784b46fc79ab6943793ac13a4cbdad0f2016b70c6cc075f32a896b6ac',
  })
  sender: string;

  @ApiProperty({
    default: '2.5',
  })
  amount: string;
}

export class GetTransactionDto {
  @ApiProperty({
    default: 'b2abe9f421a6c8e8f331f734f863148561d5e8d1a4672d38bce1551e95a9c76b',
  })
  txHash: string;
}

export class GetChildTransactionDto {
  @ApiProperty({
    default: 1,
  })
  id: number;
}

export class ReturnChildDto {
  @ApiProperty({
    default: 'b2abe9f421a6c8e8f331f734f863148561d5e8d1a4672d38bce1551e95a9c76b',
  })
  txHash: string;

  @ApiProperty({
    default: 'processing',
  })
  status: string;
}
