import { Controller } from '@nestjs/common';
import { Crud, CrudController } from "@nestjsx/crud";
import { UsersService } from "./users.service";
import { User } from "../user/entities/user.entity";


@Crud({
  model: {
    type: User,
  },
})

@Controller('api/users')
export class UsersController implements CrudController<User> {
  constructor(
    public readonly service: UsersService
  ) {}
}
