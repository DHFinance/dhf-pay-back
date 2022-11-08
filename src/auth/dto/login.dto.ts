import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'User mail',
    default: 'kriruban1@gmail.com',
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    description: 'Password in plain text',
    default: '1234',
  })
  password: string;

  @ApiProperty()
  captchaToken?: string;
}
