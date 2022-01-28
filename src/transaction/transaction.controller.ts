import { Body, Controller, Get, Headers, HttpException, HttpStatus, Param, Post } from "@nestjs/common";
import { Crud, CrudController } from "@nestjsx/crud";
import { Transaction } from "./entities/transaction.entity";
import { TransactionService } from "./transaction.service";
import { UserService } from "../user/user.service";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";

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

@ApiTags('transaction')
@Controller('transaction')
@ApiBearerAuth('Bearer')
export class TransactionController implements CrudController<Transaction> {
  constructor(
    public readonly service: TransactionService,
    public readonly userService: UserService,
    public readonly TransactionService: TransactionService,
  ) {}


  /**
   * @description если Authorization не указан или не существует магазин с таким apiKey, то выдается массив со всеми записями. Если магазин с таким apiKey существует - выдает массив платежей, которые зависят от payment, которые зависят от этого магазина
   */
  @Get()
  async getAllByStore(@Param() param, @Headers() headers) {
    const user = await this.userService.findByToken(headers['authorization'].slice(7))

    if (user?.role === 'admin') {
      const transactions = await this.service.find()
      return transactions
    }
    try {
      const transactions = await this.service.find()
      const filterByApi = transactions.filter((transaction) => {
        return transaction.payment.store.apiKey === headers.authorization.slice(7)
      })
      return filterByApi
    } catch (err) {
      throw new HttpException('This store does not have such a payments', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * @description выдача последней совершенной транзакции для payment с :id
   */
  @Get('/last/:id')
  async getLastTransaction(@Param() param, @Headers() headers) {

    try {
      const transaction = await this.TransactionService.findOne({
        where: {
          payment: param.id
        }
      })
      return transaction
    } catch (err) {
      throw new HttpException('This payment does not have such a transaction', HttpStatus.BAD_REQUEST);
    }
  }


  /**
   * @description поиск по txHash для транзакции
   */
  @Get(':txHash')
  async getOneByStore(@Param() param, @Headers() headers) {



    const user = await this.userService.findByToken(headers['authorization'])

    try {
      const transaction = await this.service.findOne({
        where: {
          txHash: param.txHash,
        }
      })
      if (!transaction) {
        throw new HttpException('Transaction not exist', HttpStatus.BAD_REQUEST);
      }
      console.log(transaction, param.txHash)
      return transaction
    } catch (err) {
      throw new HttpException('This store does not have such a transaction', HttpStatus.BAD_REQUEST);
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


