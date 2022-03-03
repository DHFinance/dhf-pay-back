import {Controller, Get, Headers, HttpException, HttpStatus, Inject, Param, Post, Response} from "@nestjs/common";
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
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CreateOnePaymentDto} from "./dto/createOnePayment.dto";
import {StoresService} from "../stores/stores.service";

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
     * @description if Authorization is not specified or there is no store with such apiKey, then an array with all entries is returned. If a store with such apiKey exists, returns an array of payments that depend on this store
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
        return payments
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

  @Override()
  @ApiResponse({
    status: 201, description: 'Get create one base response', type: CreateOnePaymentDto })
  async createOne(
      @ParsedRequest() req: CrudRequest,
      @ParsedBody() dto: Payment,
      @Headers() headers
  ) {
    try {
      /**
       * @description all payments are sent to create in dhf-pay-processor using RabbitMQ. After processing on the server, the id of the created payment is returned. The store to which the created payment will be linked is determined by apiKey, which is passed to headers.authorization
       * @data {amount: {number}, comment: {string}, apiKey: {string}}
       * @return {id: {number}}
       */
      const res = await this.service.create(dto, headers.authorization.slice(7));
      return {id: res.id};
    } catch (err) {
      console.log("error");
      throw new HttpException(err.response, HttpStatus.BAD_REQUEST);
    }


    // return this.base.createOneBase(req, dto);
  }



  @Override('getOneBase')
  getOneAndDoStuff(
    @ParsedRequest() req: CrudRequest,
  ) {
    return this.base.getOneBase(req);
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