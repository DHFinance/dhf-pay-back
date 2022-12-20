import { ApiProperty } from '@nestjs/swagger';

interface UserInterface {
  id: number;
  role: string;
}

interface UserInterfaceStores {
  id: number;
  name: string;
  lastName: string;
  email: string;
  role: string;
  company: string;
  blocked: boolean;
}

export class ReturnCreateStoreDto {
  @ApiProperty({
    default: 1,
  })
  id: number;

  @ApiProperty({
    default: 'description',
  })
  description: string;

  @ApiProperty({
    default: false,
  })
  blocked: boolean;

  @ApiProperty({
    default: 'url example',
  })
  url: string;

  @ApiProperty({
    default: 'test name',
  })
  name: string;

  @ApiProperty({
    default: '9c91OXwkRUvKNK5gWn37dMuoVgdXM9ZRuTzE',
  })
  apiKey: string;

  @ApiProperty({
    default: {
      id: 1,
      role: 'customer',
    },
  })
  user: UserInterface;
}

export class ReturnGetAllStoreDto {
  @ApiProperty({
    default: 1,
  })
  id: number;

  @ApiProperty({
    default: 'description',
  })
  description: string;

  @ApiProperty({
    default: false,
  })
  blocked: boolean;

  @ApiProperty({
    default: 'url example',
  })
  url: string;

  @ApiProperty({
    default: 'test name',
  })
  name: string;

  @ApiProperty({
    default:
      '01fa50651784b46fc79ab6943793ac13a4cbdad0f2016b70c6cc075f32a896b6ac',
  })
  wallet: string;

  @ApiProperty({
    default: '9c91OXwkRUvKNK5gWn37dMuoVgdXM9ZRuTzE',
  })
  apiKey: string;

  @ApiProperty({
    default: {
      id: 1,
      role: 'customer',
      name: 'testName',
      lastName: 'test lastName',
      email: 'example@gmail.com',
      company: 'company',
      blocked: false,
    },
  })
  user: UserInterfaceStores;
}
