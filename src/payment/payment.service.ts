import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Payment } from "./entities/payment.entity";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";

@Injectable()
export class PaymentService extends TypeOrmCrudService<Payment> {
  constructor(@InjectRepository(Payment) repo) {
    super(repo);
  }


}
