import {Body, Controller, Patch, Post, Param, Headers, Get, UnauthorizedException} from "@nestjs/common";
import {
  CreateManyDto,
  Crud,
  CrudController, CrudRequest, Override, ParsedBody, ParsedRequest,
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

  get base(): CrudController<Stores> {
    return this;
  }


  @Override()
  getMany(
      @ParsedRequest() req: CrudRequest,
  ) {
    throw new UnauthorizedException()
  }



  @Override()
  createOne(
      @ParsedRequest() req: CrudRequest,
      @ParsedBody() dto: Stores,
      @Headers() token
  ) {
    if(!token?.authorization){
      throw new UnauthorizedException()
    }
    return this.base.createOneBase(req, dto);
  }

  @Override()
  createMany(
      @ParsedRequest() req: CrudRequest,
      @ParsedBody() dto: CreateManyDto<Stores>
  ) {
    throw new UnauthorizedException()
  }

  @Override('updateOneBase')
  coolFunction(
      @ParsedRequest() req: CrudRequest,
      @ParsedBody() dto: Stores,
  ) {
    return this.base.createOneBase(req, dto);
  }

  @Override('replaceOneBase')
  awesomePUT(
      @ParsedRequest() req: CrudRequest,
      @ParsedBody() dto: Stores,
  ) {
    throw new UnauthorizedException()
  }

  @Override()
  async deleteOne(
      @ParsedRequest() req: CrudRequest,
  ) {
    throw new UnauthorizedException()
  }


  @Post('block')
  @ApiProperty({ type: BlockStoreDto })
  async storeBlock(@Body() body: BlockStoreDto) {
    return this.service.changeBlockStore(body.id, body.blocked)
  }

  @Override()
  @Get('tx/:token')
  @ApiProperty()
  async getAllStores(@Headers() token) {
    if(!token?.authorization){
      throw new UnauthorizedException()
    }
    return this.service.getAllStore(token.authorization.split(' ')[1])
  }

  @Override()
  @Get(':id')
  @ApiProperty()
  async getUserStores(@Param() id, @Headers() token) {
    if(!token?.authorization){
      throw new UnauthorizedException()
    }
    return this.service.getUserStores(id, token.authorization.split(' ')[1]);
  }

  @Override()
  @Patch(':id')
  @ApiProperty()
  async updateStore(@Body() body, @Param() id, @Headers() header) {
    if(!header.authorization){
      throw new UnauthorizedException()
    }
    return this.service.updateStore(body, id, header.authorization.split(' ')[1]);
  }
}

