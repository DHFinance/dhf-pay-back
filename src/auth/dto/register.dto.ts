import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty({
    description: 'Почта пользователя',
    default: 'kriruban1@gmail.com',
  })
  name: string;
  @ApiProperty({
    description: 'Имя',
    default: 'kri',
  })
  lastName: string;
  @ApiProperty({
    description: 'Фамилия',
    default: 'ruban',
  })
  email: string;
  @ApiProperty({
    description: 'Компания',
    default: 'mail.ru',
  })
  company: string;
  @ApiProperty({
    description: 'Незашифрованный пароль',
    default: '1234',
  })
  password: string;
}
