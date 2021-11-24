import { Injectable, Logger } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Transaction } from "./entities/transaction.entity";
import { Interval } from "@nestjs/schedule";
import { HttpModule, HttpService } from "@nestjs/axios";

@Injectable()
export class TransactionService extends TypeOrmCrudService<Transaction> {
  constructor(@InjectRepository(Transaction) repo, private httpService: HttpService) {
    super(repo);
  }

  @Interval(60000)
  async updateTransactions() {
    const transactions = await this.repo.find();
    const updateProcessingTransactions = await Promise.all(transactions.map(async (transaction) => {
      if (transaction.status === 'processing') {
        const res = await this.httpService.get(`https://event-store-api-clarity-testnet.make.services/deploys/${transaction.txHash}`).toPromise();
        if (res.data.data.errorMessage) {
          return {
            ...transaction,
            status: 'error',
            updated: res.data.data.timestamp
          }
        }
        if (!res.data.data.errorMessage && res.data.data.blockHash) {
          return {
            ...transaction,
            status: 'success',
            updated: res.data.data.timestamp
          }
        }
      }
      return transaction
    }))

    await this.repo.save(updateProcessingTransactions)
  }
}
