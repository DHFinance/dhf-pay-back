import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Payment } from "./entities/payment.entity";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Interval } from "@nestjs/schedule";
import { Transaction } from "../transaction/entities/transaction.entity";
import { TransactionService } from "../transaction/transaction.service";
import { MailerService } from "@nest-modules/mailer";

@Injectable()
export class PaymentService extends TypeOrmCrudService<Payment> {
  constructor(@InjectRepository(Payment) repo,
              private readonly transactionService: TransactionService,
              private mailerService: MailerService
  ) {
    super(repo);
  }

  async sendMailBill(billMailDto) {
    const payment = await this.repo.findOne({
      where: {
        id: billMailDto.id
      }, relations: ['store']
    })
    
    await this.mailerService.sendMail({
      to: billMailDto.email,
      from: process.env.MAILER_EMAIL,
      subject: `Payment to store ${payment.store.name}`,
      template: 'send-mail-bill',
      context: {
        email: billMailDto.email,
        billUrl: billMailDto.billUrl,
        store: payment.store.name,
        comment: payment.comment,
        amount: payment.amount,
      },
    });
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

  async create(dto, apiKey) {
    try {
      console.log("service", apiKey);
      const storeId = await this.repo.findOne({
        where: {
          apiKey: apiKey
        }, relations: ['store']
      })
      console.log("storeId", storeId);
      const payment = await this.repo.save({...dto, storeId: storeId});
      return payment
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
