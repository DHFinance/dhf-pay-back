import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

class CreatePaymentWithPosTerminalRequest {
  @IsString()
  @IsNumberString()
  @IsNotEmpty()
  @ApiProperty({
    example: '250000',
    description: 'The amount of the payment',
  })
  amount: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'USDT',
    description: 'The devise of the payment',
  })
  devise: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The description of the payment',
  })
  description?: string;
}

export { CreatePaymentWithPosTerminalRequest };
