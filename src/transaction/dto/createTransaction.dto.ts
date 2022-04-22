import {IsNotEmpty, IsNumberString, Min} from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

interface paymentInterface {
  id: number,
}

export class CreateTransactionDto {
  id?: number

  status?: string

  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  txHash: string

  @IsNotEmpty()
  sender: string

  @IsNotEmpty()
  payment: paymentInterface

}