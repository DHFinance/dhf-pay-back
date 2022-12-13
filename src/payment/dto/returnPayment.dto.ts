import { ApiProperty } from '@nestjs/swagger';
import { CurrencyType } from '../../currency/currency.enum';

interface Wallet {
  value: string;
  currency: CurrencyType;
}

interface storeInterface {
  id: number;
  wallets: Wallet[];
}

export class ReturnPaymentDto {
  @ApiProperty({
    default: 1,
  })
  id: number;

  @ApiProperty({
    default: 'data',
  })
  datetime: string;

  @ApiProperty({
    default: '2.5',
  })
  amount: string;

  @ApiProperty({
    default: 'Not_paid',
  })
  status: string;

  @ApiProperty({
    default: 'comment',
  })
  comment: string;

  @ApiProperty({
    default: null,
  })
  type: number;

  @ApiProperty({
    default: 'text button',
  })
  text: string;

  @ApiProperty({
    default: false,
  })
  cancelled?: boolean;

  @ApiProperty()
  url: string;

  @ApiProperty({
    default: {
      id: 1,
      wallets: [
        {
          value: 'wallet value',
          currency: CurrencyType.Casper,
        },
      ],
    },
  })
  store: storeInterface;
}

export class returnCreatePaymentDto {
  @ApiProperty({
    default: 1,
  })
  id: number;
}
