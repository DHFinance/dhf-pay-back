import { ApiProperty } from "@nestjs/swagger";
import {IsNotEmpty, IsNumberString, Min} from 'class-validator';
import {Type} from "class-transformer";

export class CreateOnePaymentDto {
    @ApiProperty({
        description: 'Payment id',
        default: 4,
    })
    id: number

  @Type(() => Number)
  @Min(2500000000)
  @IsNotEmpty({
    message: 'amount cant be empty'
  })
  amount: string
}
