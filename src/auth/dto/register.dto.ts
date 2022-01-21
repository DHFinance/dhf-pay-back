import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {

  @ApiProperty({
    description: 'Имя',
    default: 'kri',
  })
  name: string;
  @ApiProperty({
    description: 'Фамилия',
    default: 'ruban',
  })
  lastName: string;
  @ApiProperty({
    description: 'Почта пользователя',
    default: 'kriruban1@gmail.com',
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
