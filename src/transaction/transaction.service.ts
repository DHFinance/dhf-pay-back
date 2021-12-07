import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Transaction } from "./entities/transaction.entity";
import { Interval } from "@nestjs/schedule";
import { HttpModule, HttpService } from "@nestjs/axios";
import { MailerService } from "@nest-modules/mailer";

@Injectable()
export class TransactionService extends TypeOrmCrudService<Transaction> {
  constructor(@InjectRepository(Transaction) repo, private httpService: HttpService, private mailerService: MailerService) {
    super(repo);
  }

}
