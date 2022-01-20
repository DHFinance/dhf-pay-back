import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({
    description: 'Почта пользователя',
    default: 'kriruban1@gmail.com',
  })
  email: string;
  @ApiProperty({
    description: 'Пароль в незашифрованном виде',
    default: '1234',
  })
  password: string;
}
