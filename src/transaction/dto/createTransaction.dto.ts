import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

interface paymentInterface {
  id: number;
}

export class CreateTransactionDto {
  @ApiProperty({
    default: 'example@gmail.com',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    default: 'b2abe9f421a6c8e8f331f734f863148561d5e8d1a4672d38bce1551e95a9c76b',
  })
  @IsNotEmpty()
  txHash: string;

  @ApiProperty({
    default:
      '01fa50651784b46fc79ab6943793ac13a4cbdad0f2016b70c6cc075f32a896b6ac',
  })
  @IsNotEmpty()
  sender: string;

  @ApiProperty({
    default: {
      id: 1,
    },
  })
  @IsNotEmpty()
  payment: paymentInterface;
}
