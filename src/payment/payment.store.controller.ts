import { Body, Controller, Get, Headers, HttpException, HttpStatus, Inject, Param, Post } from "@nestjs/common";

import { Payment } from "./entities/payment.entity";
import { PaymentService } from "./payment.service";
import { ClientProxy } from "@nestjs/microservices";
import { UserService } from "../user/user.service";

@Controller('/payment')
export class PaymentStoreController {

  constructor(
    public readonly service: PaymentService,
    public readonly userService: UserService,
    @Inject('PAYMENT_SERVICE') private readonly client: ClientProxy
  ) {}

}

