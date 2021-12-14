import { Body, Controller, Get, HttpException, HttpStatus, Inject, Param, Post } from "@nestjs/common";
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

@Controller(':apiKey/payment')
export class PaymentStoreController {

  constructor(
    public readonly service: PaymentService,
    @Inject('PAYMENT_SERVICE') private readonly client: ClientProxy
  ) {}


  @Get()
  async getAllByStore(@Param() param) {
    try {
      const payments = this.service.find({
        where: {
          store: {
            apiKey: param.apiKey
          }
        }, relations: ['store']
      })
      return payments
    } catch (err) {
      throw new HttpException('This store does not have such a payments', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async getOneByStore(@Param() param) {
    try {
      const payments = this.service.findOne({
        where: {
          id: param.id,
          store: {
            apiKey: param.apiKey
          }
        }, relations: ['store']
      })
      return payments
    } catch (err) {
      throw new HttpException('This store does not have such a payment', HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  async createByStore(@Param() param: {apiKey: string}, @Body() dto: Payment) {
    try {
      const res = await this.client.send('createOne', { ...dto, apiKey: param.apiKey }).toPromise()
      return {id: res}
    } catch (err) {
      throw new HttpException(err.response, HttpStatus.BAD_REQUEST);
    }
  }

}

