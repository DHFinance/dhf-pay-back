import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { createHmac } from "crypto";
import { ensureProgram } from "ts-loader/dist/utils";
import { StoresService } from "../stores/stores.service";
const bcrypt = require("bcrypt");

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly storesService: StoresService) {}

  /**
   *
   * @param password
   */
  encryptPassword = (password: string): string => {
    const saltRounds = 7
    const salt = bcrypt.genSaltSync(saltRounds)
    const hashed = bcrypt.hashSync(password, salt); // GOOD
    return hashed;
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

  /**
   *
   * @param loginUserDto {LoginDto}
   * @description user authorization. If the password and email are correct - returns an object with the user
   * @return {User}
   */
  public async login(loginUserDto) {
    const user = await this.userService.findByEmail(loginUserDto.email);
    /**
     * @description if the user has not yet entered his code that was sent to him by email - he is not considered verified
     */
    if (user?.emailVerification !== null) {
      throw new BadRequestException('email', 'User is not exist');
    }
    if (user) {
      /**
       * @description password comparison using the bcrypt algorithm. login UserDto.password - encrypted from the front, user.password - encrypted from the database
       */
      const match = await bcrypt.compare(loginUserDto.password, user.password)
      if (match) {
        return user
      } else {
        throw new BadRequestException('password', 'wrong password')
      }
    } else {
      throw new BadRequestException('email', 'user with this email does not exist');
    }
  }
}
