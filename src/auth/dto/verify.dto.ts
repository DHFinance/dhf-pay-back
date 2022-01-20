import { ApiProperty } from "@nestjs/swagger";

export class VerifyDto {
  @ApiProperty({
    description: 'Почта пользователя, введенная ранее при регистрации',
    default: 'kriruban1@gmail.com',
  })
  email: string;
  @ApiProperty(
    {
      description: 'Код, пришедший на почту для подтверждения email',
      default: '12345678',
    },
  )
  code: string;
}
