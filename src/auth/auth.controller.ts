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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(@Body() registerUserDto: RegisterDto) {
    try {
      // console.log(await this.authService.register(registerUserDto))
      return await this.authService.register(registerUserDto);
    } catch (err) {
      // console.log(err)
      throw new HttpException(err.response, HttpStatus.BAD_REQUEST);
    }
  }
  @Post('login')
  public async login(@Body() loginUserDto: LoginDto) {
    try {
      return await this.authService.login(loginUserDto);
    } catch (err) {
      throw new HttpException(err.response, HttpStatus.BAD_REQUEST);
    }
  }
  @Post('send-code')
  public async sendCode(@Body() resetUserDto: ResetEmailDto) {
    try {
      await this.authService.sendCode(resetUserDto);
      return true;
    } catch (err) {
      throw new HttpException(err.response, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('reAuth')
  public async reAuth(@Body() resetUserDto: ResetEmailDto, @Query() query) {

    try {
      return await this.authService.reAuth(query.token);
    } catch (err) {
      throw new HttpException(err.response, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('check-code')
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

  @Post('reset-pwd')
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
