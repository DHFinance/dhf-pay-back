import { BadRequestException, HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Transaction } from "./entities/transaction.entity";
import { Interval } from "@nestjs/schedule";
import { HttpModule, HttpService } from "@nestjs/axios";
import { MailerService } from "@nestjs-modules/mailer";
import { StoresService } from "../stores/stores.service";
import {PaymentService} from "../payment/payment.service";
import {Payment} from "../payment/entities/payment.entity";

@Injectable()
export class TransactionService extends TypeOrmCrudService<Transaction> {
  constructor(@InjectRepository(Transaction) repo, private readonly paymentService: PaymentService, private readonly storesService: StoresService, private httpService: HttpService, private mailerService: MailerService,
              ) {
    super(repo);
  }

  async sendMail(transaction) {
    try {
      await this.mailerService.sendMail({
        to: transaction.email,
        from: process.env.MAILER_EMAIL,
        subject: `Payment to store ${transaction.payment.store.name}`,
        template: 'create-transaction',
        context: {
          email: transaction.email,
          store: transaction.payment.store.name,
          status: transaction.status,
        },
      });
    } catch (e) {
      console.log(e)
    }
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

      const findPayment = await Payment.findOne({
        where: {
          id: transaction.payment.id
        }
      });

      if (!findPayment) {
        throw new HttpException('payment ID incorrect', HttpStatus.BAD_REQUEST);
      }


      if (findPayment.type === null && findPayment.status === 'Paid') {
        throw new HttpException('payment already completed', HttpStatus.BAD_REQUEST);
      }

      if (findPayment.cancelled) {
        throw new HttpException('payment already cancelled', HttpStatus.BAD_REQUEST);
      }

      const res = await this.repo.save({
        ...transaction,
        amount: findPayment.amount.toString(),
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
        status: res.status,
        payment: {
          id: res.payment.id,
          datetime: res.payment.datetime,
          status: res.payment.status,
          store: {
            id: res.payment.store.id
          }
        },
      }
      try {
        await this.sendMail(res);
      } catch (e) {
        console.log(e)
      }
      return sendTransaction
    }
}
