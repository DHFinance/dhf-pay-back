import { BadRequestException, HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Transaction } from "./entities/transaction.entity";
import { Interval } from "@nestjs/schedule";
import { HttpModule, HttpService } from "@nestjs/axios";
import { MailerService } from "@nestjs-modules/mailer";
import { StoresService } from "../stores/stores.service";
import e from "express";

@Injectable()
export class TransactionService extends TypeOrmCrudService<Transaction> {
  constructor(@InjectRepository(Transaction) repo, private readonly storesService: StoresService, private httpService: HttpService, private mailerService: MailerService) {
    super(repo);
  }

  async create(transaction) {
    try {
      const activeTransaction = await this.repo.findOne({
        where: {
          payment: transaction?.payment?.id,
          status: 'processing'
        }
      })

      if (activeTransaction.payment.type !== 2) {
        console.log("activeTransaction", activeTransaction)
        throw new HttpException('Current payment transaction is already being processed', HttpStatus.BAD_REQUEST);
      }


      const res = this.repo.save({
        ...transaction,
        amount: transaction?.payment?.amount || 0,
        updated: new Date() })
      return res
    } catch (err) {
      console.log(err.message)
      throw new HttpException(err.response, HttpStatus.BAD_REQUEST);
    }
  }

}
