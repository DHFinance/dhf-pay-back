import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, Min } from 'class-validator';

export class CreateOnePaymentDto {
  id?: number;

  @ApiProperty({
    description: 'amount cspr',
    default: '2.5',
    required: true,
  })
  @Type(() => Number)
  @Min(2.5)
  @IsNotEmpty({
    message: 'amount cant be empty',
  })
  amount: string;

  cancelled?: boolean;

  text?: string;
}
