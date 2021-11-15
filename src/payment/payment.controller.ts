import { Controller } from '@nestjs/common';
import { Crud, CrudController } from "@nestjsx/crud";
import { Payment } from "./entities/payment.entity";
import { PaymentService } from "./payment.service";

@Crud({
  model: {
    type: Payment,
  },
})

@Controller('api/payment')
export class PaymentController implements CrudController<Payment> {
  constructor(
    public readonly service: PaymentService
  ) {}
}
