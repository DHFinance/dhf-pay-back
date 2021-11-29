import { Controller } from '@nestjs/common';
import { Crud, CrudController } from "@nestjsx/crud";
import { Transaction } from "./entities/transaction.entity";
import { TransactionService } from "./transaction.service";

@Crud({
  model: {
    type: Transaction,
  },
  query: {
    join: {
      payment: {
        eager: true,
      },
    },
  },
})

@Controller('transaction')
export class TransactionController implements CrudController<Transaction> {
  constructor(
    public readonly service: TransactionService
  ) {}
}

