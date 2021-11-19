import { Controller, Get, UseGuards } from '@nestjs/common';
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
}
