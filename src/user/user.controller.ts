import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  @UseGuards(AuthGuard('bearer'))
  async getAll(): Promise<any> {
    return await this.userService.findAll();
  }
}
