import { ApiProperty } from '@nestjs/swagger';
import { StorePublicInfo } from '../../stores/interfaces/storePublicInfo.interface';

class GetPosTerminalInfoResponseDto {
  @ApiProperty({
    description: 'Id of the POS terminal',
    example: 2,
  })
  id: number;

  @ApiProperty({
    description: 'Name of the POS terminal',
    example: 'Test pos',
  })
  name: string;

  @ApiProperty({
    description: 'The store to which the POS terminal belongs',
    example: {
      id: 2,
      name: 'Test store',
    },
  })
  store: StorePublicInfo;

  @ApiProperty({
    description: 'Url of logo of the POS terminal',
    example: 'logo-url',
  })
  logo: string;
}

export { GetPosTerminalInfoResponseDto };
