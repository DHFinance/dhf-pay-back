import {
  Body,
  Controller, Get,
  HttpException,
  HttpStatus, Param,
  Post, Query
} from "@nestjs/common";
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from "./dto/login.dto";
import { ChangePasswordDto, ResetCodeDto, ResetEmailDto } from "./dto/reset.dto";
import { VerifyDto } from "./dto/verify.dto";
import { ApiProperty, ApiTags } from "@nestjs/swagger";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   *
   * @param registerUserDto {RegisterDto}
   * @description User registration, stage 1. Receives user data, sends a confirmation code in a letter to the specified email
   */
  @Post('register')
  @ApiProperty({ type: RegisterDto })
  public async register(@Body() registerUserDto: RegisterDto) {
    try {
      // console.log(await this.authService.register(registerUserDto))
      console.log(registerUserDto)
      return await this.authService.register(registerUserDto);
    } catch (err) {
      console.log(err)
      throw new HttpException(err.response, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   *
   * @param verifyDto {VerifyDto}
   * @description User registration, stage 2. receives the confirmation code, compares it with what is written on the back. If the code is correct, you can log in to this user
   */
  @Post('verify')
  @ApiProperty({ type: VerifyDto })
  public async verify(@Body() verifyDto: VerifyDto) {
    try {
      return await this.authService.verify(verifyDto);
    } catch (err) {
      throw new HttpException(err.response, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   *
   * @param loginUserDto {LoginDto}
   * @description login. searches for a user by email and checks the password. If all data is correct - issues a token
   */
  @Post('login')
  @ApiProperty({ type: LoginDto })
  public async login(@Body() loginUserDto: LoginDto) {
    try {
      const user = await this.authService.login(loginUserDto);
      console.log({user})
      return user
    } catch (err) {
      throw new HttpException(err.response, HttpStatus.BAD_REQUEST);
    }
  }
  /**
   *
   * @param loginUserDto {LoginDto}
   * @description Password recovery stage 1. searches for a user by email sends a code to the mail. Return true to move to the next step
   * @return true
   */
  @Post('send-code')
  @ApiProperty({ type: ResetEmailDto })
  public async sendCode(@Body() resetUserDto: ResetEmailDto) {
    try {
      await this.authService.sendCode(resetUserDto);
      return true;
    } catch (err) {
      throw new HttpException(err.response, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   *
   * @param query {token: string}
   * @description check if the user exists in the database. Occurs every time the page is reloaded
   */
  @Get('reAuth')
  @ApiProperty()
  public async reAuth(@Query() query) {

    try {
      return await this.authService.reAuth(query.token);
    } catch (err) {
      throw new HttpException(err.response, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   *
   * @param resetUserPasswordDto {ResetCodeDto}
   * @description Password recovery stage 2. Comparison of the code that came from the front and the code from the user's record. If the codes match, move on to the next step.
   */
  @Post('check-code')
  @ApiProperty({ type: ResetCodeDto })
  public async checkCode(@Body() resetUserPasswordDto: ResetCodeDto) {

    try {
      const user = await this.authService.checkCode(resetUserPasswordDto);
      if (user) {
        return {
          code: user.restorePasswordCode
        }
      }
    } catch (err) {
      throw new HttpException(err.response, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   *
   * @param changeUserPasswordDto {ChangePasswordDto}
   * @description Password recovery stage 3. Password change, receives a new password and replaces the current one with it. Sends user data
   * @return {User}
   */
  @Post('reset-pwd')
  @ApiProperty({ type: ChangePasswordDto })
  public async reset(@Body() changeUserPasswordDto: ChangePasswordDto) {
    try {
      const user = await this.authService.changePassword(changeUserPasswordDto);
      if (user) {
        return user
      }
    } catch (err) {
      throw new HttpException(err.response, HttpStatus.BAD_REQUEST);
    }
  }
}
