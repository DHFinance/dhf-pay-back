import { Controller } from '@nestjs/common';
import { Crud, CrudController } from "@nestjsx/crud";
import { TransactionService } from "./transaction.service";
import { Transaction } from "./entities/transaction.entity";

@Crud({
  model: {
    type: Transaction,
  },
})

@Controller('api/transaction')
export class TransactionController implements CrudController<Transaction> {
  constructor(
    public readonly service: TransactionService
  ) {}
}

