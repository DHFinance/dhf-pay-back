import { Injectable } from '@nestjs/common';
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

  @Interval(10000)
  async updateStatus() {
    await this.transactionService.updateTransactions()
    const payments = await this.repo.find();
    const updatedPayments = await Promise.all(payments.map(async (payment) => {
      const transactions = await this.transactionService.find({
        where: {
          payment: payment,
          status: 'success'
        }
      });

      const getTransactionsTotal = () => {
        let counter = 0
        transactions.forEach((transaction, i) => {
          counter += +transaction.amount
        })
        return counter
      }
      if (payment.status !== 'Paid') {
        if (getTransactionsTotal() >= +payment.amount) {
          payment.status = 'Paid'
          return await this.mailerService.sendMail({
            to:  payment.user.email,
            from: 'service-info@smartigy.ru',
            subject: 'Код для сброса пароля',
            template: 'transaction-status-changed',
            context: {
              login: payment.user.email,
              email: payment.user.email,
              status: payment.status,
            },
          });
          return payment
        }
        if (getTransactionsTotal() !== +payment.amount && getTransactionsTotal() > 0) {
          payment.status = 'Particularly_paid'
          return payment
        }
      }
      return payment
    }))

    await this.repo.save(updatedPayments)
  }
}
