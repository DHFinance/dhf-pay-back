import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { createHmac } from "crypto";
import { ensureProgram } from "ts-loader/dist/utils";
import { StoresService } from "../stores/stores.service";

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly storesService: StoresService) {}

  encryptPassword = (password: string): string => {
    return createHmac('sha1', process.env.SECRET_HASH)
      .update(password)
      .digest('hex');
  };

  public async validate(token, as) {
    if (as === 'user') {
      const user = await this.userService.findByToken(token.slice(7));
      return user
    }
    if (as === 'store') {
      const store = await this.storesService.validateStore(token.slice(7));
      return store
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
      password: this.encryptPassword(userDto.password)
    }

    await this.userService.create(user);
  }

  public async verify({email, code}) {
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
    const encryptPassword = this.encryptPassword(password)
    return await this.userService.changePassword(encryptPassword, email);
  }

  public async login(loginUserDto) {
    const user = await this.userService.findByEmail(loginUserDto.email);
    if (user?.emailVerification !== null) {
      throw new BadRequestException('email', 'User is not exist');
    }
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
