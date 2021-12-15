import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { Crud, CrudController } from '@nestjsx/crud';
import { User } from './entities/user.entity';
import { UserService } from "./user.service";

@Crud({
  model: {
    type: User,
  },
})

@Controller('user')
export class UserController implements CrudController<User> {
  constructor(
    public readonly service: UserService
  ) {}

  @Post('block')
  async storeBlock(@Body() body: {id: number, blocked: boolean}) {
    return this.service.changeBlockUser(body.id, body.blocked)
  }
}
