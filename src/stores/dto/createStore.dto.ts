import {IsNotEmpty, MaxLength, MinLength} from 'class-validator';

interface userInterface {
  id: number
}

export class CreateStoreDto {
  id: string

  @IsNotEmpty({
    message: 'url cant be empty'
  })
  url: string

  @IsNotEmpty({
    message: 'name cant be empty'
  })
  name: string

  @IsNotEmpty({
    message: 'wallet cant be empty'
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

  @IsNotEmpty()
  user: userInterface
}
