import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { UserService } from '../user/user.service';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super();
  }

  async validate(token: string) {
    const user = await this.userService.findByToken(token);
    const store = await this.storesService.validateStore(token);
    if (!user) {
      return store;
    }
    if (!store) {
      return user;
    }
    if (!user && !store) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
