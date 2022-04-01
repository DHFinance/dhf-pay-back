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
   * @description if Authorization is not specified or there is no store with such apiKey, then an array with all entries is returned. If a store with such apiKey exists, returns an array of payments that depend on payment that depend on this store
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
   * @description return last completed transaction for payment with :id
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

  // @Get(':id')
  // async getInvoices(@Param() id, @Headers() token) {
  //   const user = await this.userService.findByToken(token['authorization'].split(' ')[1])
  //
  //   if (!user) {
  //     return false
  //   }
  //   try {
  //     const transaction = await this.service.findOne({
  //       where: {
  //         txHash: token.txHash,
  //       }
  //     })
  //     if (!transaction) {
  //       throw new HttpException('Invoices not exist', HttpStatus.BAD_REQUEST);
  //     }
  //
  //     return transaction
  //   } catch (err) {
  //     throw new HttpException('This store does not have such a transaction', HttpStatus.BAD_REQUEST);
  //   }
  // }


  /**
   * @description search by txHash for transaction
   */
  @Get(':txHash')
  async getOneByStore(@Param() param, @Headers() headers) {



    const user = await this.userService.findByToken(headers['authorization'].split(' ')[1])

    if (!user) {
      return false
    }

    try {
      const transaction = await this.service.findOne({
        where: {
          txHash: param.txHash,
        }
      })
      if (!transaction) {
        throw new HttpException('Transaction not exist', HttpStatus.BAD_REQUEST);
      }

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


