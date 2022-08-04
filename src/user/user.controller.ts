import {
  Body,
  Controller, Get,
  Post,
  Headers, BadRequestException, HttpException, HttpStatus
} from "@nestjs/common";
import { Crud, CrudController} from "@nestjsx/crud";
import { User } from './entities/user.entity';
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiProperty, ApiTags } from "@nestjs/swagger";
import { BlockUserDto } from "./dto/block.dto";

// @Crud({
//   model: {
//     type: User,
//   },
// })

@ApiTags('user')
@Controller('user')
@ApiBearerAuth('Bearer')
export class UserController implements CrudController<User> {
  constructor(
    public readonly service: UserService
  ) {}

  @Post('block')
  @ApiProperty({ type: BlockUserDto })
  async storeBlock(@Body() body: BlockUserDto) {
    return this.service.changeBlockUser(body.id, body.blocked)
  }

  @Get()
  @ApiProperty()
  async getUsers(@Headers() headers) {
    const user = await this.service.findByToken(headers['authorization'].split(' ')[1])
    if (user?.role === 'admin') {
      return await this.service.find({});
    } else {
      throw new HttpException('Your not admin', HttpStatus.BAD_REQUEST);
    }
  }
}


