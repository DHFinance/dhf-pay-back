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
  @Post('verify')
  @ApiProperty({ type: VerifyDto })
  public async verify(@Body() verifyDto: VerifyDto) {
    try {
      return await this.authService.verify(verifyDto);
    } catch (err) {
      throw new HttpException(err.response, HttpStatus.BAD_REQUEST);
    }
  }
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

  @Get('reAuth')
  @ApiProperty({ type: ResetEmailDto })
  public async reAuth(@Body() resetUserDto: ResetEmailDto, @Query() query) {

    try {
      return await this.authService.reAuth(query.token);
    } catch (err) {
      throw new HttpException(err.response, HttpStatus.BAD_REQUEST);
    }
  }

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
