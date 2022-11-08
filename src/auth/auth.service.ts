import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { StoresService } from '../stores/stores.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly storesService: StoresService,
    private readonly httpService: HttpService,
  ) {}

  /**
   *
   * @param password
   */
  encryptPassword = (password: string): string => {
    const saltRounds = 7;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashed = bcrypt.hashSync(password, salt); // GOOD
    return hashed;
  };

  public async checkCaptcha(token: string) {
    const result = await this.httpService
      .post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${token}`,
      )
      .toPromise();
    return result.data.success;
  }

  public async validate(token, as) {
    if (as === 'user') {
      const user = await this.userService.findByToken(token.slice(7));
      return user;
    }
    if (as === 'store') {
      const store = await this.storesService.validateStore(token.slice(7));
      return store;
    }
  }

  public async register(userDto) {
    const user = {
      name: userDto.name,
      lastName: userDto.lastName,
      company: userDto.company,
      email: userDto.email,
      role: 'customer',
      blocked: userDto.blocked,
      password: this.encryptPassword(userDto.password),
      loginAttempts: 0,
      timeBlockLogin: null,
    };

    await this.userService.create(user);
  }

  public async verify({ email, code }) {
    return await this.userService.verifyUser(email, code);
  }

  public async sendCode({ email }) {
    await this.userService.sendCode(email);
  }

  public async checkCode({ code, email }) {
    return await this.userService.checkCode(code, email);
  }

  public async reAuth(token: string) {
    return await this.userService.reAuth(token);
  }

  public async changePassword({ password, email }) {
    const encryptPassword = this.encryptPassword(password);
    return await this.userService.changePassword(encryptPassword, email);
  }

  /**
   *
   * @param loginUserDto {LoginDto}
   * @description user authorization. If the password and email are correct - returns an object with the user
   * @return {User}
   */
  public async login(loginUserDto) {
    const user = await this.userService.findByEmail(loginUserDto.email);
    const captcha = await this.checkCaptcha(loginUserDto.captchaToken);
    if (!captcha) {
      throw new HttpException('set Captcha', HttpStatus.BAD_REQUEST);
    }
    if (user) {
      /**
       * @description if the user has not yet entered his code that was sent to him by email - he is not considered verified
       */
      if (new Date(user?.timeBlockLogin) > new Date()) {
        throw new BadRequestException('email or password', 'try again latter');
      }
      if (user?.emailVerification !== null) {
        await this.userService.setAttempts(user.email, true);
        throw new BadRequestException(
          'email or password',
          'email or password incorrect',
        );
      }
      /**
       * @description password comparison using the bcrypt algorithm. login UserDto.password - encrypted from the front, user.password - encrypted from the database
       */
      const res = await bcrypt.compare(loginUserDto.password, user.password);
      if (res) {
        await this.userService.setAttempts(user.email, false);
        const userData = await this.userService.setToken(user.email);
        delete userData.password;
        return userData;
      } else {
        await this.userService.setAttempts(user.email, true);
        throw new BadRequestException(
          'email or password',
          'email or password incorrect',
        );
      }
    } else {
      throw new BadRequestException(
        'email or password',
        'email or password incorrect',
      );
    }
  }
}
