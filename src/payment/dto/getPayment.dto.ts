import { ApiProperty } from '@nestjs/swagger';

export class GetPaymentDto {
  @ApiProperty({
    default: 'dasd123-asd34-dasds',
  })
  url: string;
}
