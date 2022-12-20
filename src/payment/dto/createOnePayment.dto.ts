import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { CurrencyType } from '../../currency/currency.enum';

export class CreateOnePaymentDto {
  @ApiProperty({
    description: 'amount cspr',
    default: '2.5',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty({
    message: 'amount cant be empty',
  })
  amount: number;

  @ApiProperty({
    description: 'Currency of the payment',
    example: CurrencyType.Casper,
  })
  @IsEnum(CurrencyType)
  currency: CurrencyType;

  @ApiProperty({
    description: 'Description of the payment',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  text?: string;

  @ApiProperty({
    description: 'Description of the payment',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  comment?: string;

  @ApiProperty({
    description: 'Type of the payment button',
  })
  @IsNumber()
  @Min(1)
  @Max(3)
  @IsOptional()
  type?: number;
}
