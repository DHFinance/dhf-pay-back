import { ApiProperty } from "@nestjs/swagger";

export class ResetEmailDto {
  @ApiProperty({
    description: 'Почта пользователя, потерявшего пароль',
    default: 'kriruban1@gmail.com',
  })
  email: string;
}

export class ResetCodeDto {
  @ApiProperty({
    description: 'Почта пользователя, указанная на предыдущем этапе (reset)',
    default: 'kriruban1@gmail.com',
  })
  email: string;
  @ApiProperty({
    description: 'Код, пришедший в письме на почту',
    default: '12345678',
  })
  code: string;
}

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Новый пароль',
    default: '1234',
  })
  password: string;
  @ApiProperty({
    description: 'Почта пользователя, указанная на предыдущем этапе (reset)',
    default: 'kriruban1@gmail.com',
  })
  email: string;
}