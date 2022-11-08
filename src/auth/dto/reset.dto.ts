import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches } from 'class-validator';

export class ResetEmailDto {
  @ApiProperty({
    description: 'Email of the user who lost the password',
    default: 'kriruban1@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty()
  captchaToken?: string;
}

export class ResetCodeDto {
  @ApiProperty({
    description: 'User email specified in the previous step (reset)',
    default: 'kriruban1@gmail.com',
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    description: 'Code sent by email',
    default: '12345678',
  })
  code: string;

  captchaToken?: string;
}

export class ChangePasswordDto {
  @ApiProperty({
    description: 'New password',
    default: '1234',
  })
  @Matches(
    '(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}',
    '',
    {
      message:
        'The password must contain at least 8 characters, 1 special character, 1 uppercase character',
    },
  )
  password: string;
  @ApiProperty({
    description: 'User email specified in the previous step (reset)',
    default: 'kriruban1@gmail.com',
  })
  @IsEmail()
  email: string;
}
