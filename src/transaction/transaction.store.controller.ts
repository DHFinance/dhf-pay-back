import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from "@nestjs/common";
import { Crud, CrudController } from "@nestjsx/crud";
import { Transaction } from "./entities/transaction.entity";
import { TransactionService } from "./transaction.service";
import { Payment } from "../payment/entities/payment.entity";
import { PaymentService } from "../payment/payment.service";
import { UserService } from "../user/user.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags('transaction store')
@Controller('/transaction')
@ApiBearerAuth('JWT')
export class TransactionStoreController {
  constructor(
    public readonly service: TransactionService,
    public readonly userService: UserService,
  ) {}

}

