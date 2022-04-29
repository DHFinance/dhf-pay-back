import {ApiProperty} from "@nestjs/swagger";

interface storeInterface {
  id: number
  wallet: string
}

export class ReturnPaymentDto {
  @ApiProperty({
    default: 1
  })
  id: number

  @ApiProperty({
    default: "data"
  })
  datetime: string

  @ApiProperty({
    default: '2.5'
  })
  amount: string

  @ApiProperty({
    default: 'Not_paid'
  })
  status: string

  @ApiProperty({
    default: 'comment'
  })
  comment: string

  @ApiProperty({
    default: null
  })
  type: number

  @ApiProperty({
    default: 'text button'
  })
  text: string

  @ApiProperty({
    default: false
  })
  cancelled?: boolean

  @ApiProperty({
    default: {
      id: 1,
      wallet: 'wallet'
    }
  })
  store: storeInterface
}

export class returnCreatePaymentDto {
  @ApiProperty({
    default: 1
  })
  id: number
}