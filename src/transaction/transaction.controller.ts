import { Body, Controller, Get, Headers, HttpException, HttpStatus, Param, Post } from "@nestjs/common";
import { Crud, CrudController } from "@nestjsx/crud";
import { Transaction } from "./entities/transaction.entity";
import { TransactionService } from "./transaction.service";
import { UserService } from "../user/user.service";

@Crud({
  model: {
    type: Transaction,
  },
  query: {
    join: {
      payment: {
        eager: true,
      },
    },
  },
})

@Controller('transaction')
export class TransactionController implements CrudController<Transaction> {
  constructor(
    public readonly service: TransactionService,
    public readonly userService: UserService,
  ) {}


  @Get()
  async getAllByStore(@Param() param, @Headers() headers) {
    const user = await this.userService.findByToken(headers['authorization-x'])
    if (user.role === 'admin') {
      const transactions = this.service.find()
      return transactions
    }
    try {
      const transactions = await this.service.find()
      const filterByApi = transactions.filter((transaction) => transaction.payment.store.apiKey === param.apiKey)
      return filterByApi
    } catch (err) {
      throw new HttpException('This store does not have such a payments', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':txHash')
  async getOneByStore(@Param() param, @Headers() headers) {

    const user = await this.userService.findByToken(headers['authorization-x'])

    try {
      const transaction = await this.service.findOne({
        where: {
          txHash: param.txHash,
        }
      })
      return transaction
    } catch (err) {
      throw new HttpException('This store does not have such a payment', HttpStatus.BAD_REQUEST);
    }
    // if (user?.role === 'admin') {
    //   const transaction = await this.service.findOne({
    //     where: {
    //       txHash: param.txHash
    //     }
    //   })
    //   return transaction
    // }
    // try {
    //   const transaction = await this.service.findOne({
    //     where: {
    //       txHash: param.txHash,
    //     }, relations: ['payment', 'payment.store']
    //   })
    //   if (transaction.payment.store.apiKey === headers.authorization) {
    //     return transaction
    //   } else {
    //     throw new HttpException('This payment does not belong to you', HttpStatus.BAD_REQUEST);
    //   }
    // } catch (err) {
    //   throw new HttpException('This store does not have such a payment', HttpStatus.BAD_REQUEST);
    // }
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


