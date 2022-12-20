import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsNotEmpty } from 'class-validator';
import { Wallet } from '../../wallets/interfaces/wallet.interface';

interface userInterface {
  id: number;
}

export class CreateStoreDto {
  id: string;

  @ApiProperty({
    default: 'Url example',
  })
  @IsNotEmpty({
    message: "Url can't be empty",
  })
  url: string;

  @ApiProperty({
    default: 'test name',
  })
  @IsNotEmpty({
    message: "Name can't be empty",
  })
  name: string;

  @ApiProperty()
  @ArrayMinSize(1)
  wallets: Wallet[];

  apiKey?: string;

  blocked?: boolean;

  user?: userInterface;
}
