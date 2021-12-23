import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
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

  // @Interval(1000)
  // async getStore(){
  //   const parentParent = await this.repo.findOne({
  //     where: {
  //       store: {
  //         user: 1
  //       }
  //     },
  //     relations: ['store', 'store.user']
  //   })
  //   console.log(parentParent)
  // }

  // async create(dto) {
  //   try {
  //     const payment = this.repo.create(dto)
  //     return payment
  //   } catch (err) {
  //     throw new HttpException(err, HttpStatus.BAD_REQUEST);
  //   }
  // }
}
