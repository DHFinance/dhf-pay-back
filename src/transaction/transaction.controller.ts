import {Body, Controller, Get, Headers, HttpException, HttpStatus, Param, Patch, Post, Put, Res} from "@nestjs/common";
import {Crud, CrudController, Override} from "@nestjsx/crud";
import { Transaction } from "./entities/transaction.entity";
import { TransactionService } from "./transaction.service";
import { UserService } from "../user/user.service";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import {StoresService} from "../stores/stores.service";
import {Response} from "express";

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
    public readonly storeService: StoresService,
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
      const returnInfo = {
        txHash: transaction.txHash,
        status: transaction.status,
      }
      return returnInfo
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

  @Override()
  @Patch(":id")
  async patchTransaction() {
    throw new HttpException('Error', HttpStatus.BAD_REQUEST)
  }

  @Override()
  @Put(":id")
  async putTransaction() {
    throw new HttpException('Error', HttpStatus.BAD_REQUEST)
  }


  /**
   * @description search by txHash for transaction
   */
  @Get(':txHash')
  async getOneByStore(@Param() param, @Headers() headers, @Res({ passthrough: true }) res: Response) {



    const user = await this.userService.findByToken(headers['authorization'].split(' ')[1])

    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND)
    }

    try {
      const transaction = await this.service.findOne({
        where: {
          txHash: param.txHash,
        }
      })
      if (!transaction) {
        res.status(HttpStatus.BAD_REQUEST).send('Transaction not exist');
        return;
      }

      const store = await this.storeService.findOne({
        where: {
          id: transaction.payment.store.id
        },
        relations: ['user']
      })

      if (store.user.token !== user.token) {
        res.status(HttpStatus.CONFLICT).send('No access to this transaction');
        return;
        //throw new HttpException('No access to this transaction', HttpStatus.CONFLICT);
      }

      delete transaction.payment.store.apiKey
      return transaction
    } catch (err) {
      throw new HttpException('This store does not have such a transaction', HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  async createByStore(@Param() param: {apiKey: string}, @Body() dto: Transaction) {
    const findTransaction = await this.service.findOne({
      where: {
        id: dto.id
      }
    });

    if (findTransaction) {
      throw new HttpException('transaction already exists', HttpStatus.BAD_REQUEST)
    }

    if (dto.status !== 'progress') {
      throw new HttpException('cant create transaction with status "success"', HttpStatus.BAD_REQUEST)
    }

    if (!dto?.payment?.id) {
      throw new HttpException('cant create transaction without payment ID', HttpStatus.BAD_REQUEST)
    }

    try {
      const res = await this.service.create(dto)
      return res
    } catch (err) {
      throw new HttpException(err.response, HttpStatus.BAD_REQUEST);
    }
  }
}


