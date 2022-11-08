import { ApiProperty } from '@nestjs/swagger';

export class VerifyDto {
  @ApiProperty({
    description: 'User mail entered earlier during registration',
    default: 'kriruban1@gmail.com',
  })
  email: string;
  @ApiProperty({
    description: 'Code sent to email to confirm email',
    default: '12345678',
  })
  code: string;
}
