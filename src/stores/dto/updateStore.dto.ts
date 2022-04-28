import {IsNotEmpty, MaxLength, MinLength} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

interface userInterface {
  id: number
}

interface userInterfaceReturn {
  id: number
  role: string
}

export class UpdateStoreDto {
  id?: string

  @ApiProperty({
    default: 'test url'
  })
  @IsNotEmpty({
    message: 'url cant be empty'
  })
  url: string

  @ApiProperty({
    default: 'test name'
  })
  @IsNotEmpty({
    message: 'name cant be empty'
  })
  name: string

  @ApiProperty({
    default: 'test wallet'
  })
  @IsNotEmpty({
    message: 'wallet cant be empty'
  })
  @MinLength(20, {
    message: 'wallet is too short. Minimal length is $constraint1 characters'
  })
  wallet: string

  @ApiProperty({
    default: 'can be empty'
  })
  description?: string

  @ApiProperty({
    default: '9c91OXwkRUvKNK5gWn37dMuoVgdXM9ZRuTzE'
  })
  @MinLength(36, {
    message: 'ApiKey is too short. Minimal length is $constraint1 characters'
  })
  @MaxLength(36, {
    message: 'ApiKey is too long. Maximal length is $constraint1 characters'
  })
  apiKey?:string

  blocked?: boolean

  user?: userInterface
}


export class ReturnUpdateStoreDto {
  @ApiProperty({
    default: 1
  })
  id: number

  @ApiProperty({
    default: 'test name'
  })
  name:string

  @ApiProperty({
    default: 'test url'
  })
  url: string

  @ApiProperty({
    default: '01fa50651784b46fc79ab6943793ac13a4cbdad0f2016b70c6cc075f32a896b6ac'
  })
  wallet: string

  @ApiProperty({
    default: 'description'
  })
  description: string

  @ApiProperty({
    default: '9c91OXwkRUvKNK5gWn37dMuoVgdXM9ZRuTzE'
  })
  apiKey: string

  @ApiProperty({
    default: {
      id: 1,
      role: "customer"
    }
  })
  user: userInterfaceReturn
}