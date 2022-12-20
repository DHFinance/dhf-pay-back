import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

class LoginPosTerminalWithQRRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Code',
    example: 'dasfaDW32141fsdxcx',
  })
  code: string;
}

export { LoginPosTerminalWithQRRequest };
