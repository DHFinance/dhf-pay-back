import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString, Min } from "class-validator";
import {Type} from "class-transformer";

export class CreateOnePaymentDto {
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

  cancelled?: boolean

  text?: string
}
