import { BadRequestException, HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Transaction } from "./entities/transaction.entity";
import { Interval } from "@nestjs/schedule";
import { HttpModule, HttpService } from "@nestjs/axios";
import { MailerService } from "@nestjs-modules/mailer";
import { StoresService } from "../stores/stores.service";
import {PaymentService} from "../payment/payment.service";

@Injectable()
export class TransactionService extends TypeOrmCrudService<Transaction> {
  constructor(@InjectRepository(Transaction) repo, private readonly paymentService: PaymentService, private readonly storesService: StoresService, private httpService: HttpService, private mailerService: MailerService,
              ) {
    super(repo);
  }

  async create(transaction) {
      const findTransaction = await this.repo.findOne({
        where: {
          txHash: transaction.txHash
        }
      })

      if (findTransaction) {
        throw new HttpException('transaction already exist', HttpStatus.BAD_REQUEST);
      }

      const findPayment = await this.paymentService.findPayment(transaction.payment.id);

      if (!findPayment) {
        throw new HttpException('payment ID incorrect', HttpStatus.BAD_REQUEST);
      }

    console.log(findPayment);

      if (findPayment.type === null && findPayment.status === 'Paid') {
        throw new HttpException('payment already completed', HttpStatus.BAD_REQUEST);
      }

      // if (activeTransaction.payment.type !== 2) {
      //   console.log("activeTransaction", activeTransaction)
      //   throw new HttpException('Current payment transaction is already being processed', HttpStatus.BAD_REQUEST);
      // }


      const res = await this.repo.save({
        ...transaction,
        amount: findPayment.amount,
        status: 'processing',
        updated: new Date(),
        payment: findPayment
      })
      const sendTransaction = {
        id: res.id,
        email: res.email,
        txHash: res.txHash,
        sender: res.sender,
        amount: res.amount,
        payment: {
          id: res.payment.id,
          datetime: res.payment.datetime,
          status: res.payment.status,
          store: {
            id: res.payment.store.id
          }
        }
      }
      return sendTransaction
    }
}
