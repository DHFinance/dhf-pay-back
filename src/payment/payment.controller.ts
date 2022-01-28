import { Controller, Get, Headers, HttpException, HttpStatus, Inject, Param, Post } from "@nestjs/common";
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
import { UserService } from "../user/user.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

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
      store: {
        eager: true,
      },
      transaction: {
        eager: true,
      },
    },
  },
})


@ApiTags('payment')
@Controller('payment')
@ApiBearerAuth('Bearer')
export class PaymentController implements CrudController<Payment> {
  constructor(
    public readonly service: PaymentService,
    public readonly userService: UserService,
    @Inject('PAYMENT_SERVICE') private readonly client: ClientProxy
  ) {}


  @Get()
  async getAllByStore(@Headers() headers) {
    /**
     * @description если Authorization не указан или не существует магазин с таким apiKey, то выдается массив со всеми записями. Если магазин с таким apiKey существует - выдает массив платежей, которые зависят от этого магазина
     */
    if (!headers['authorization']) {
      const payments = await this.service.find()
      return payments
    } else {
      try {
        const payments = await this.service.find({
          where: {
            store: {
              apiKey: headers.authorization.slice(7)
            }
          }, relations: ['store']
        })
        if (payments.length) {
          return payments
        } else {
          const allPayments = await this.service.find()
          return allPayments
        }

      } catch (err) {
        throw new HttpException('This store does not have such a payments', HttpStatus.BAD_REQUEST);
      }
    }
  }

  get base(): CrudController<Payment> {
    return this;
  }

  @Override()
  getMany(
    @ParsedRequest() req: CrudRequest,
  ) {
    // const user = this.userService.findByToken()
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
    @Headers() headers
  ) {
    try {
      /**
       * @description все payment отправляются на создание в dhf-pay-processor с помощью RabbitMQ. После обработки на сервере возвращается id созданного payment. Магазин, к которому будет привязан созданный payment, определяется по apiKey, который передается в headers.authorization
       * @data {amount: {number}, comment: {string}, apiKey: {string}}
       * @return {id: {number}}
       */
      const res = await this.client.send('createOne', { ...dto, apiKey: headers.authorization.slice(7)  }).toPromise()
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

