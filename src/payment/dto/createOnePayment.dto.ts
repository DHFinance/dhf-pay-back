import { ApiProperty } from "@nestjs/swagger";

export class CreateOnePaymentDto {
    @ApiProperty({
        description: 'Payment id',
        default: 4,
    })
    id: number
}
