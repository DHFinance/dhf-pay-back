import { ApiProperty } from "@nestjs/swagger";

export class BillMailDto {
  @ApiProperty({
    description: 'Link to bill page',
    default: 'localhost:4000/bill/27',
  })
  billUrl: string;
  @ApiProperty({
    description: 'Buyers mail',
    default: 'kriruban1@gmail.com',
  })
  email: string;
  @ApiProperty({
    description: 'bill id',
    default: 27,
  })
  id: number
}
