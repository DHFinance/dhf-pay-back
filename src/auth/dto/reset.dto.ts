import { ApiProperty } from "@nestjs/swagger";

export class ResetEmailDto {
  @ApiProperty({
    description: 'Email of the user who lost the password',
    default: 'kriruban1@gmail.com',
  })
  email: string;
}

export class ResetCodeDto {
  @ApiProperty({
    description: 'User email specified in the previous step (reset)',
    default: 'kriruban1@gmail.com',
  })
  email: string;
  @ApiProperty({
    description: 'Code sent by email',
    default: '12345678',
  })
  code: string;
}

export class ChangePasswordDto {
  @ApiProperty({
    description: 'New password',
    default: '1234',
  })
  password: string;
  @ApiProperty({
    description: 'User email specified in the previous step (reset)',
    default: 'kriruban1@gmail.com',
  })
  email: string;
}