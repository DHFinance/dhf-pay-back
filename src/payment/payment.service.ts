import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Payment } from "./entities/payment.entity";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Interval } from "@nestjs/schedule";
import { Transaction } from "../transaction/entities/transaction.entity";
import { TransactionService } from "../transaction/transaction.service";

@Injectable()
export class PaymentService extends TypeOrmCrudService<Payment> {
  constructor(@InjectRepository(Payment) repo,
              private readonly transactionService: TransactionService,
  ) {
    super(repo);
  }

  @Interval(60000)
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
