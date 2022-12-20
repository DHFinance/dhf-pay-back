import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

class LoginPosTerminalRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Login',
    example: 'testlogin',
  })
  login: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Password',
    example: 'dasdasd12312wqDqwe',
  })
  password: string;
}

export { LoginPosTerminalRequestDto };
