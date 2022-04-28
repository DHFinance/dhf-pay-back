import { ApiProperty } from "@nestjs/swagger";
import {IsNotEmpty, Min, MinLength} from 'class-validator';
import {Type} from "class-transformer";

export class CreateOnePaymentDto {
    @ApiProperty({
        description: 'Payment id',
        default: 4,
    })
    id?: number

  @ApiProperty({
    description: 'amount cspr',
    default: "2.5",
    required: true
  })
  @Type(() => Number)
  @Min(2.5)
  @IsNotEmpty({
    message: 'amount cant be empty'
  })
  amount: string

  text?: string
}
