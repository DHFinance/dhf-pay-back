import { Controller, Get, HttpException, HttpStatus, Inject, Param, Post } from "@nestjs/common";
import {
  Crud,
  CrudController,
  Override,
  CrudRequest,
  ParsedRequest,
  ParsedBody,
  CreateManyDto,
} from '@nestjsx/crud';
import { Payment } from "./entities/payment.entity";
import { PaymentService } from "./payment.service";
import { ClientProxy } from "@nestjs/microservices";
import { SCondition } from "@nestjsx/crud-request";

@Crud({
  model: {
    type: Payment,
  },
  params: {
    apiKey: {
      field: 'apiKey',
      type: "string",
    },
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

@Controller(':apiKey/payment')
export class PaymentController implements CrudController<Payment> {
  constructor(
    public readonly service: PaymentService,
    @Inject('PAYMENT_SERVICE') private readonly client: ClientProxy
  ) {}

  get base(): CrudController<Payment> {
    return this;
  }

  @Override()
  getMany(
    @ParsedRequest() req: CrudRequest,
  ) {
    return this.base.getManyBase(req);
  }

  @Override('getOneBase')
  getOneAndDoStuff(
    @ParsedRequest() req: CrudRequest,
  ) {
    return this.base.getOneBase(req);
  }

  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Payment,
    @Param() param: {apiKey: string}
  ) {
    try {
      const res = await this.client.send('createOne', { ...dto, apiKey: param.apiKey }).toPromise()
      return {id: res}
    } catch (err) {
      throw new HttpException(err.response, HttpStatus.BAD_REQUEST);
    }


    // return this.base.createOneBase(req, dto);
  }

  @Override()
  createMany(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<Payment>
  ) {
    return this.base.createManyBase(req, dto);
  }

  @Override('updateOneBase')
  coolFunction(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Payment,
  ) {
    return this.base.updateOneBase(req, dto);
  }

  @Override('replaceOneBase')
  awesomePUT(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Payment,
  ) {
    return this.base.replaceOneBase(req, dto);
  }

  @Override()
  async deleteOne(
    @ParsedRequest() req: CrudRequest,
  ) {
    return this.base.deleteOneBase(req);
  }
}

