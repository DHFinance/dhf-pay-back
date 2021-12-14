import { BadRequestException, HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Transaction } from "./entities/transaction.entity";
import { Interval } from "@nestjs/schedule";
import { HttpModule, HttpService } from "@nestjs/axios";
import { MailerService } from "@nest-modules/mailer";
import { StoresService } from "../stores/stores.service";
import e from "express";

@Injectable()
export class TransactionService extends TypeOrmCrudService<Transaction> {
  constructor(@InjectRepository(Transaction) repo, private readonly storesService: StoresService, private httpService: HttpService, private mailerService: MailerService) {
    super(repo);
  }

  async create(transaction) {
    try {
      const store = await this.storesService.findStore(transaction.apiKey)

      if (store) {
        const res = this.repo.save(transaction)
        return res
      } else {
        throw new HttpException('Store not found', HttpStatus.BAD_REQUEST);
      }
    } catch (err) {
      throw new HttpException(err.response, HttpStatus.BAD_REQUEST);
    }
  }

}
