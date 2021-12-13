import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Payment } from "./entities/payment.entity";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Interval } from "@nestjs/schedule";
import { Transaction } from "../transaction/entities/transaction.entity";
import { TransactionService } from "../transaction/transaction.service";
import { MailerService } from "@nest-modules/mailer";

@Injectable()
export class PaymentService extends TypeOrmCrudService<Payment> {g
  constructor(@InjectRepository(Payment) repo,
              private readonly transactionService: TransactionService,
              private mailerService: MailerService
  ) {
    super(repo);
  }
}
