import { Controller, Get, Inject, Post } from "@nestjs/common";
import { Crud, CrudController } from "@nestjsx/crud";
import { Payment } from "./entities/payment.entity";
import { PaymentService } from "./payment.service";
import { ClientProxy } from "@nestjs/microservices";

@Crud({
  model: {
    type: Payment,
  },
})

@Controller('payment')
export class PaymentController implements CrudController<Payment> {
  constructor(
    public readonly service: PaymentService,
    @Inject('PAYMENT_SERVICE') private readonly client: ClientProxy
  ) {}

  @Get('/create')
  async hello() {
    this.client.emit('hello', 'payment created')
  }
}

