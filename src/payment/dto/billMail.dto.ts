import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class BillMailDto {
  @ApiProperty({
    description: 'Link to bill page',
    default: 'localhost:4000/bill/27',
  })
  @IsString()
  billUrl: string;
  @ApiProperty({
    description: 'Buyers mail',
    default: 'kriruban1@gmail.com',
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    description: 'bill id',
    default: 27,
  })
  id: number;
}
