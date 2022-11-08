import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CrudController, Override } from '@nestjsx/crud';
import { UserService } from '../user/user.service';
import { randomString } from '../utils/randomString';
import { BlockStoreDto, ReturnBlockStoreDto } from './dto/block.dto';
import { CreateStoreDto } from './dto/createStore.dto';
import { GetStoreDto } from './dto/getStore.dto';
import {
  ReturnCreateStoreDto,
  ReturnGetAllStoreDto,
} from './dto/returnCreateStore.dto';
import { ReturnUpdateStoreDto, UpdateStoreDto } from './dto/updateStore.dto';
import { Stores } from './entities/stores.entity';
import { StoresService } from './stores.service';

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
  @ApiOperation({ summary: 'Create new store' })
  @ApiProperty({ description: 'create new store' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'admin cant create store',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'store already exist',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "you can't create store with incorrect blocked status",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'you cant create store',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'store not found',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: ReturnCreateStoreDto,
  })
  @ApiHeader({
    name: 'auth token',
    description: 'Bearer sgRcXvaZrsd0NNxartp09RFFApSRq8E8g1lc',
  })
  async createOne(@Body() dto: CreateStoreDto, @Headers() token) {
    if (!token?.authorization) {
      throw new UnauthorizedException();
    }
    const user = await this.userService.findByTokenSelected(
      token.authorization.split(' ')[1],
    );
    if (user.role === 'admin') {
      throw new HttpException(
        'admin cant create store',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (dto.id) {
      const findStore = await this.service.find({
        where: {
          id: dto.id,
        },
      });
      if (findStore.length !== 0) {
        throw new HttpException('store already exist', HttpStatus.BAD_REQUEST);
      }
    }
    if (!dto.apiKey) {
      dto = { ...dto, apiKey: randomString(36) };
    }
    if (!dto.user) {
      dto = { ...dto, user };
    }
    if (!dto.blocked) {
      dto = { ...dto, blocked: false };
    }
    if (typeof dto.blocked !== 'boolean' || dto.blocked === true) {
      throw new HttpException(
        "you can't create store with incorrect blocked status",
        HttpStatus.BAD_REQUEST,
      );
    }
    if (dto.user) {
      if (user.id !== dto?.user?.id) {
        throw new HttpException(
          'you cant create store',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    return this.service.create(dto);
  }

  @Override()
  createMany() {
    throw new UnauthorizedException();
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
  async deleteOne() {
    throw new UnauthorizedException();
  }

  @Post('block')
  @ApiProperty({ type: BlockStoreDto, description: 'block store' })
  @ApiOperation({ summary: 'block store' })
  @ApiHeader({
    name: 'auth token',
    description: 'Bearer sgRcXvaZrsd0NNxartp09RFFApSRq8E8g1lc',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'There is no admin with this token',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: ReturnBlockStoreDto,
  })
  async storeBlock(@Body() body: BlockStoreDto) {
    return this.service.changeBlockStore(body.id, true);
  }

  @Post('unblock')
  @ApiProperty({ type: BlockStoreDto, description: 'unblock store' })
  @ApiOperation({ summary: 'unblock store' })
  @ApiHeader({
    name: 'auth token',
    description: 'Bearer sgRcXvaZrsd0NNxartp09RFFApSRq8E8g1lc',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'There is no admin with this token',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: ReturnBlockStoreDto,
  })
  async storeUnblock(@Body() body: BlockStoreDto) {
    return this.service.changeBlockStore(body.id, false);
  }

  // @Override()
  // @Get('tx/:token')
  // @ApiProperty()
  // async getAllStores(@Headers() token) {
  //   if(!token?.authorization){
  //     throw new UnauthorizedException()
  //   }
  //   return this.service.getAllStore(token.authorization.split(' ')[1])
  // }

  @Override()
  @Get()
  @ApiProperty({ description: 'get all stores' })
  @ApiOperation({ summary: 'get all stores' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'user not found',
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'stores not found',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: [ReturnGetAllStoreDto],
  })
  @ApiHeader({
    name: 'auth token',
    description: 'Bearer sgRcXvaZrsd0NNxartp09RFFApSRq8E8g1lc',
  })
  async getStores(@Headers() token) {
    if (!token?.authorization) {
      throw new UnauthorizedException();
    }
    const user = await this.userService.findByToken(
      token.authorization.split(' ')[1],
    );
    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    if (user.role === 'admin') {
      return await this.service.find({ relations: ['user'] });
    }
    return this.service.getAllStore(token.authorization.split(' ')[1]);
  }

  @Override()
  @Get(':id')
  @ApiProperty({
    description: 'get store by id',
  })
  @ApiOperation({
    summary: 'Get store by id',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: ReturnGetAllStoreDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiOkResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'store not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'you are not the creator of the store',
  })
  @ApiHeader({
    name: 'auth token',
    description: 'Bearer sgRcXvaZrsd0NNxartp09RFFApSRq8E8g1lc',
  })
  async getUserStores(@Param() id: GetStoreDto, @Headers() token) {
    if (!token?.authorization) {
      throw new UnauthorizedException();
    }
    return this.service.getUserStore(id, token.authorization.split(' ')[1]);
  }

  @Override()
  @Put(':id')
  @ApiProperty({
    description: 'update store by id',
  })
  @ApiOperation({
    summary: 'Update store by id',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiHeader({
    name: 'auth token',
    description: 'Bearer sgRcXvaZrsd0NNxartp09RFFApSRq8E8g1lc',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'you cant change user',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'you cant change ID',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'you cant change blocked status',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: ReturnUpdateStoreDto,
  })
  async putUpdateStore(
    @Body() body: UpdateStoreDto,
    @Param() id,
    @Headers() header,
  ) {
    if (!header.authorization) {
      throw new UnauthorizedException();
    }
    return this.service.updateStore(
      body,
      id,
      header.authorization.split(' ')[1],
    );
  }

  @Override()
  @Patch(':id')
  @ApiProperty({
    description: 'update store by id',
  })
  @ApiOperation({
    summary: 'Update store by id',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiHeader({
    name: 'auth token',
    description: 'Bearer sgRcXvaZrsd0NNxartp09RFFApSRq8E8g1lc',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'you cant change user',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'you cant change ID',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'you cant change blocked status',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: ReturnUpdateStoreDto,
  })
  async updateStore(
    @Body() body: UpdateStoreDto,
    @Param() id,
    @Headers() header,
  ) {
    if (!header.authorization) {
      throw new UnauthorizedException();
    }
    return this.service.updateStore(
      body,
      id,
      header.authorization.split(' ')[1],
    );
  }
}
