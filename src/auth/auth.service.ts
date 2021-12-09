import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { createHmac } from "crypto";
import { ensureProgram } from "ts-loader/dist/utils";

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  encryptPassword = (password: string): string => {
    return createHmac('sha1', process.env.SECRET_HASH)
      .update(password)
      .digest('hex');
  };

  public async validate(token) {
    return await this.userService.findByToken(token);
  }

  public async register(userDto) {

    const user = {
      name: userDto.name,
      lastName: userDto.lastName,
      company: userDto.company,
      email: userDto.email,
      role: 'customer',
      password: this.encryptPassword(userDto.password),
    }

    return await this.userService.create(user);
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
    const encryptPassword = this.encryptPassword(password)
    return await this.userService.changePassword(encryptPassword, email);
  }

  public async login(loginUserDto) {
    const user = await this.userService.findByEmail(loginUserDto.email);
    if (user) {
      if (this.encryptPassword(loginUserDto.password) === user.password) {
        return user
      }
      else {
        throw new BadRequestException('password', 'wrong password');
      }
    } else {
      throw new BadRequestException('email', 'user with this email does not exist');
    }
  }
}
