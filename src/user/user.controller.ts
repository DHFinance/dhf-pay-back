import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  UseGuards
} from "@nestjs/common";
import { CreateManyDto, Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from "@nestjsx/crud";
import { User } from './entities/user.entity';
import { UserService } from "./user.service";
import { Payment } from "../payment/entities/payment.entity";
import { PaymentService } from "../payment/payment.service";
import { ClientProxy } from "@nestjs/microservices";

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

  @Post('block')
  async storeBlock(@Body() body: {id: number, blocked: boolean}) {
    return this.service.changeBlockUser(body.id, body.blocked)
  }
}


