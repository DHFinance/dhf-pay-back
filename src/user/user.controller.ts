import {
  Body,
  Controller,
  Post,
} from "@nestjs/common";
import { Crud, CrudController} from "@nestjsx/crud";
import { User } from './entities/user.entity';
import { UserService } from "./user.service";
import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { BlockUserDto } from "./dto/block.dto";

@Crud({
  model: {
    type: User,
  },
})

@ApiTags('user')
@Controller('user')
export class UserController implements CrudController<User> {
  constructor(
    public readonly service: UserService
  ) {}

  @Post('block')
  @ApiProperty({ type: BlockUserDto })
  async storeBlock(@Body() body: BlockUserDto) {
    return this.service.changeBlockUser(body.id, body.blocked)
  }
}


