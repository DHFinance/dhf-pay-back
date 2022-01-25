import { Body, Controller, Post } from "@nestjs/common";
import {
  Crud,
  CrudController,
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
      },
      transaction: {
        eager: true,
      },
    },
  },
})

@ApiTags('store')
@Controller('store')
@ApiBearerAuth('JWT')
export class StoresController implements CrudController<Stores> {
  constructor(
    public readonly service: StoresService,
  ) {}


  @Post('block')
  @ApiProperty({ type: BlockStoreDto })
  async storeBlock(@Body() body: BlockStoreDto) {
    return this.service.changeBlockStore(body.id, body.blocked)
  }

}

