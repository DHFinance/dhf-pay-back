import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../../payment/entities/payment.entity';
import { StorePublicInfo } from '../../stores/interfaces/storePublicInfo.interface';

class CreatePaymentWithPosTerminalResponse {
  @ApiProperty({
    description: 'Id of the payment',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Amount of the payment',
    example: '250000',
  })
  amount: string;

  @ApiProperty({
    description: 'Currency of the payment',
    example: 'USDT',
  })
  currency: string;

  @ApiProperty({
    description: 'Status of the payment',
    example: Status.Not_paid,
  })
  status: Status;

  @ApiProperty({
    description: 'Description of the payment',
    example: 'Test description',
  })
  description: string;

  @ApiProperty({
    description: 'The store to which the payment belongs',
    example: {
      id: 2,
      name: 'Test store',
    },
  })
  store: StorePublicInfo;
}

export { CreatePaymentWithPosTerminalResponse };
