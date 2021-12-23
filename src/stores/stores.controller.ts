import { Body, Controller, Get, HttpException, HttpStatus, Inject, Post } from "@nestjs/common";
import {
  Crud,
  CrudController,
  Override,
  CrudRequest,
  ParsedRequest,
  ParsedBody,
  CreateManyDto,
} from '@nestjsx/crud';
import { StoresService } from "./stores.service";
import { ClientProxy } from "@nestjs/microservices";
import { SCondition } from "@nestjsx/crud-request";
import { Stores } from "./entities/stores.entity";
import { UserService } from "../user/user.service";

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

@Controller('store')
export class StoresController implements CrudController<Stores> {
  constructor(
    public readonly service: StoresService,
    public readonly userService: UserService,

  ) {}
x
  @Post('block')
  async storeBlock(@Body() body: {id: number, blocked: boolean}) {
    return this.service.changeBlockStore(body.id, body.blocked)
  }

}

