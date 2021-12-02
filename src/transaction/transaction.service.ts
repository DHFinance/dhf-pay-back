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

  async sendMail(transaction) {

    return await this.mailerService.sendMail({
      to: transaction.email,
      from: 'caspers.mailer@gmail.com',
      subject: 'Код для сброса пароля',
      template: 'transaction-status-changed',
      context: {
        login: transaction.email,
        email: transaction.email,
        txHash: transaction.txHash,
        status: transaction.status,
      },
    });
  }

  async updateTransactions() {
    const transactions = await this.repo.find();
    const updateProcessingTransactions = await Promise.all(transactions.map(async (transaction) => {
      if (transaction.status === 'processing') {
        const res = await this.httpService.get(`https://event-store-api-clarity-testnet.make.services/deploys/${transaction.txHash}`).toPromise();
        if (res.data.data.errorMessage) {
          const updatedTransaction = {
            ...transaction,
            status: res.data.data.errorMessage,
            updated: res.data.data.timestamp
          }
          await this.sendMail(updatedTransaction)
          return updatedTransaction
        }
        if (!res.data.data.errorMessage && res.data.data.blockHash) {
          const updatedTransaction = {
            ...transaction,
            status: 'success',
            updated: res.data.data.timestamp
          }
          await this.sendMail(updatedTransaction)
          return updatedTransaction
        }
      }
      return transaction
    }))

    await this.repo.save(updateProcessingTransactions)
  }


}
