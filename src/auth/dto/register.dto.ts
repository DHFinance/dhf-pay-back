import { ApiProperty } from "@nestjs/swagger";

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
  password: string;
}
