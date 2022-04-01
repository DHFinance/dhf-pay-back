import {Body, Controller, Patch, Post, Param, Headers, Get} from "@nestjs/common";
import {
  Crud,
  CrudController, CrudRequest, Override, ParsedRequest,
} from '@nestjsx/crud';
import { StoresService } from "./stores.service";
import { Stores } from "./entities/stores.entity";
import { UserService } from "../user/user.service";
import { ApiBearerAuth, ApiProperty, ApiTags } from "@nestjs/swagger";
import { BlockStoreDto } from "./dto/block.dto";

@Crud({
  model: {
    type: Stores,
  },
  query: {
    join: {
      user: {
        eager: true,
        exclude: ["password", "restorePasswordCode", "token"]
      },
      transaction: {
        eager: true,
      },
    },
  },
})

@ApiTags('store')
@Controller('store')
@ApiBearerAuth('Bearer')
export class StoresController implements CrudController<Stores> {
  constructor(
    public readonly service: StoresService,
  ) {}


  @Post('block')
  @ApiProperty({ type: BlockStoreDto })
  async storeBlock(@Body() body: BlockStoreDto) {
    return this.service.changeBlockStore(body.id, body.blocked)
  }

  @Override()
  @Get('tx/:token')
  @ApiProperty()
  async getAllStores(@Headers() token) {
    return this.service.getAllStore(token.authorization.split(' ')[1])
  }

  @Override()
  @Get(':id')
  @ApiProperty()
  async getUserStores(@Param() id, @Headers() token) {
    return this.service.getUserStores(id, token.authorization.split(' ')[1]);
  }

  @Override()
  @Patch(':id')
  @ApiProperty()
  async updateStore(@Body() body, @Param() id, @Headers() header) {
    return this.service.updateStore(body, id, header.authorization.split(' ')[1]);
  }
}

