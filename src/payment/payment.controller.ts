import { Controller, Get, HttpException, HttpStatus, Inject, Post } from "@nestjs/common";
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

@Crud({
  model: {
    type: Payment,
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

@Controller('payment')
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
  ) {
    try {
      const payment = await this.client.send('createOne', dto).toPromise().then((res) => console.log({ res })).catch(e => console.log({e}))
      console.log({payment})
      return payment
    } catch (err) {
      console.log({err})
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

