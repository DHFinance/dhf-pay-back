import {
  Body,
  Controller,
  Patch,
  Post,
  Param,
  Headers,
  Get,
  UnauthorizedException,
  HttpException,
  HttpStatus, Put
} from "@nestjs/common";
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
import { randomString } from "../utils/randomString";
import {CreateStoreDto} from "./dto/createStore.dto";

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
    public readonly userService: UserService,
  ) {}

  get base(): CrudController<Stores> {
    return this;
  }


  // @Override()
  // getMany(
  //     @ParsedRequest() req: CrudRequest,
  // ) {
  //   throw new UnauthorizedException()
  // }



  @Override()
  @Post()
  async createOne(
      @Body() dto: CreateStoreDto,
      @Headers() token
  ) {
    if(!token?.authorization){
      throw new UnauthorizedException()
    }
    if (dto.id) {
      const findStore = await this.service.find({
        where: {
          id: dto.id
        }
      })
      if (findStore.length !== 0) {
        throw new HttpException('store already exist', HttpStatus.BAD_REQUEST);
      }
    }
    if (!dto.apiKey) {
      dto = {...dto, apiKey: randomString(36)}
    }
    if (typeof dto.blocked !== "boolean" || dto.blocked === true) {
      throw new HttpException('you can\'t create store with incorrect blocked status', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.findByToken(token.authorization.split(' ')[1])
    if (user.id !== dto?.user?.id) {
      throw new HttpException('you cant create store', HttpStatus.BAD_REQUEST);
    }
    return this.service.create(dto);
  }

  @Override()
  createMany(
      @ParsedRequest() req: CrudRequest,
      @ParsedBody() dto: CreateManyDto<Stores>
  ) {
    throw new UnauthorizedException()
  }

  // @Override('updateOneBase')
  // coolFunction(
  //     @ParsedRequest() req: CrudRequest,
  //     @ParsedBody() dto: Stores,
  // ) {
  //   return this.base.createOneBase(req, dto);
  // }

  // @Override('replaceOneBase')
  // awesomePUT(
  //     @ParsedRequest() req: CrudRequest,
  //     @ParsedBody() dto: Stores,
  // ) {
  //   throw new UnauthorizedException()
  // }

  @Override()
  async deleteOne(
      @ParsedRequest() req: CrudRequest,
  ) {
    throw new UnauthorizedException()
  }


  @Post('block')
  @ApiProperty({ type: BlockStoreDto })
  async storeBlock(@Body() body: BlockStoreDto) {
    return this.service.changeBlockStore(body.id, true)
  }

  @Post('unblock')
  @ApiProperty()
  async storeUnblock(@Body() body) {
    return this.service.changeBlockStore(body.id, false)
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
  @Get()
  async getStores(@Headers() token) {
    const user = await this.userService.findByToken(token.authorization.split(' ')[1]);
    if (user.role === 'admin') {
      return await this.service.find({relations: ['user']})
    }
    throw new HttpException('you are not admin', HttpStatus.BAD_REQUEST);
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
  @Put(':id')
  @ApiProperty()
  async putUpdateStore(@Body() body, @Param() id, @Headers() header) {
    if(!header.authorization){
      throw new UnauthorizedException()
    }
    return this.service.updateStore(body, id, header.authorization.split(' ')[1]);
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

