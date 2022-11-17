import { ApiProperty } from '@nestjs/swagger';

class CreatePaymentResponseDto {
  @ApiProperty({
    description: 'Id of the created payment',
  })
  id: number;
}

export { CreatePaymentResponseDto };
