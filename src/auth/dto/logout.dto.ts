import { ApiProperty } from '@nestjs/swagger';

export class LogoutDto {
  @ApiProperty({
    default: 'test@gmail.com',
  })
  email: string;

  @ApiProperty({
    default: 'Auth Token',
  })
  token: string;
}
