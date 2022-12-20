import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RegisterDto } from './dto/register.dto';
import {
  ChangePasswordDto,
  ResetCodeDto,
  ResetEmailDto,
} from './dto/reset.dto';
import { VerifyDto } from './dto/verify.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  /**
   *
   * @param registerUserDto {RegisterDto}
   * @description User registration, stage 1. Receives user data, sends a confirmation code in a letter to the specified email
   */
  @Post('register')
  @ApiProperty({ type: RegisterDto })
  public async register(@Body() registerUserDto: RegisterDto) {
    try {
      if (await this.authService.checkCaptcha(registerUserDto.captchaToken)) {
        return await this.authService.register(registerUserDto);
      } else {
        throw new HttpException('Set Captcha', HttpStatus.BAD_REQUEST);
      }
    } catch (err) {
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
    return this.authService.verify(verifyDto);
  }

  @Post('logout')
  @ApiProperty({ type: LogoutDto })
  async logout(@Body() logoutUser: LogoutDto) {
    const user = await this.userService.findByToken(logoutUser.token);
    if (user) {
      await this.userService.clearToken(logoutUser.email);
    } else {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
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
      return this.authService.login(loginUserDto);
    } catch (err) {
      throw new HttpException(err.response, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   *
   * @description Password recovery stage 1. searches for a user by email sends a code to the mail. Return true to move to the next step
   * @return true
   */
  @Post('send-code')
  @ApiProperty({ type: ResetEmailDto })
  async sendCode(
    @Res({ passthrough: true }) response: Response,
    @Body() resetUserDto: ResetEmailDto,
  ) {
    try {
      if (await this.authService.checkCaptcha(resetUserDto.captchaToken)) {
        await this.authService.sendCode(resetUserDto);
        return true;
      } else {
        response.status(HttpStatus.BAD_REQUEST).send('Set Captcha');
        return;
      }
    } catch (err) {
      throw new HttpException(err.response, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   *
   * @param token {token: string}
   * @description check if the user exists in the database. Occurs every time the page is reloaded
   */
  @Post('reAuth')
  @ApiProperty()
  public async reAuth(@Body() token) {
    try {
      return await this.authService.reAuth(token.token);
    } catch (err) {
      throw new HttpException(err.response, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   *
   * @param response
   * @param resetUserPasswordDto {ResetCodeDto}
   * @description Password recovery stage 2. Comparison of the code that came from the front and the code from the user's record. If the codes match, move on to the next step.
   */
  @Post('check-code')
  @ApiProperty({ type: ResetCodeDto })
  public async checkCode(
    @Res({ passthrough: true }) response: Response,
    @Body() resetUserPasswordDto: ResetCodeDto,
  ) {
    const captcha = await this.authService.checkCaptcha(
      resetUserPasswordDto.captchaToken,
    );
    if (!captcha) {
      throw new HttpException('set Captcha', HttpStatus.BAD_REQUEST);
    }
    try {
      const user = await this.authService.checkCode(resetUserPasswordDto);
      if (user) {
        return {
          code: user.restorePasswordCode,
        };
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
        return user;
      }
    } catch (err) {
      throw new HttpException(err.response, HttpStatus.BAD_REQUEST);
    }
  }
}
