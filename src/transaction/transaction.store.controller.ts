import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from "@nestjs/common";
import { Crud, CrudController } from "@nestjsx/crud";
import { Transaction } from "./entities/transaction.entity";
import { TransactionService } from "./transaction.service";
import { Payment } from "../payment/entities/payment.entity";
import { PaymentService } from "../payment/payment.service";

@Controller(':apiKey/transaction')
export class TransactionStoreController {
  constructor(
    public readonly service: TransactionService,
  ) {}


  @Get()
  async getAllByStore(@Param() param) {
    try {
      const transactions = await this.service.find()
      const filterByApi = transactions.filter((transaction) => transaction.payment.store.apiKey === param.apiKey)
      return filterByApi
    } catch (err) {
      throw new HttpException('This store does not have such a payments', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async getOneByStore(@Param() param) {
    try {
      const transaction = this.service.findOne({
        where: {
          id: param.id
        }
      })
      return transaction
    } catch (err) {
      throw new HttpException('This store does not have such a payment', HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  async createByStore(@Param() param: {apiKey: string}, @Body() dto: Transaction) {
    try {
      const res = await this.service.create(dto)
      return res
    } catch (err) {
      throw new HttpException(err.response, HttpStatus.BAD_REQUEST);
    }
  }
}

