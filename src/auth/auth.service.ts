import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  public async validate(token) {
    return await this.userService.findByToken(token);
  }

  public async register(userDto) {
    return await this.userService.create(userDto);
  }
}
