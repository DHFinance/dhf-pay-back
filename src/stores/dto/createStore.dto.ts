import {IsNotEmpty, MaxLength, Min, MinLength} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

interface userInterface {
  id: number
}

export class CreateStoreDto {
  id: string

  @ApiProperty({
    default: 'url example'
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
    default: '01fa50651784b46fc79ab6943793ac13a4cbdad0f2016b70c6cc075f32a896b6ac'
  })
  @IsNotEmpty({
    message: 'wallet cant be empty'
  })
  @MinLength(20, {
    message: 'wallet is too short. Minimal length is $constraint1 characters'
  })
  wallet: string


  // @MinLength(35, {
  //   message: 'ApiKey is too short. Minimal length is $constraint1 characters'
  // })
  // @MaxLength(37, {
  //   message: 'ApiKey is too long. Maximal length is $constraint1 characters'
  // })
  apiKey?:string

  blocked?: boolean

  user?: userInterface
}
