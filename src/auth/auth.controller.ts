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
   * @description Регистрация пользователя, этап 1. Получает данные пользователя, отправляет код для подтверждения в письме на указанную email
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
   * @description Регистрация пользователя, этап 2. принимает код подтвержения, сравнивает его с тем, что записан на беке. Если код верен - на этом пользователе можно авторизироваться
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
   * @description вход в систему. ищет пользователя по email и сверяет пароль. Если все данные верны - выдает токен
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
   * @description Восстановление пароля этап 1. ищет пользователя по email отправляет на почту код. Return true для перехода к следующему этапу
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
   * @description проверка существования пользователя в базе данных. Происходит при каждой перезагрузке страницы
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
   * @description Восстановление пароля этап 2. Сравнение кода, пришедшего с фронта и кода из записи пользователя. Если коды совпадают - переходит к следующему этапу
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
   * @description Восстановление пароля этап 3. Замена пароля, получает новый пароль и заменяет им текущий. Отправляет данные пользователя
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
