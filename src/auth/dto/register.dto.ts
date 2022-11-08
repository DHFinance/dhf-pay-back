import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Name',
    default: 'kri',
  })
  name: string;
  @ApiProperty({
    description: 'Last name',
    default: 'ruban',
  })
  lastName: string;
  @ApiProperty({
    description: 'User email',
    default: 'kriruban1@gmail.com',
  })
  email: string;
  @ApiProperty({
    description: 'Company',
    default: 'mail.ru',
  })
  company: string;
  @ApiProperty({
    description: 'Unencrypted password',
    default: '1234',
  })
  // @MinLength(8, {
  //   message: 'Password is too short. Minimal length is $constraint1 characters'
  // })
  @Matches(
    '(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}',
    '',
    {
      message:
        'The password must contain at least 8 characters, 1 special character, 1 uppercase character',
    },
  )
  password: string;

  @ApiProperty()
  captchaToken?: string;
}
