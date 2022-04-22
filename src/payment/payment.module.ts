import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { ClientsModule, Transport } from "@nestjs/microservices";
import { PaymentStoreController } from "./payment.store.controller";
import { UserModule } from "../user/user.module";

const env = require('dotenv').config().parsed

@Module({
  /**
   * @description ClientsModule.register is responsible for communicating with dhf-pay-back. payment_queue is the queue through which payment will be created. Communication is carried out by url specified in RABBIT_MQ
   */
  imports: [TypeOrmModule.forFeature([Payment]), UserModule, ClientsModule.register([
    {
      name: 'PAYMENT_SERVICE',
      transport: Transport.RMQ,
      options: {
        urls: [env.RABBIT_MQ],
        queue: 'payment_queue',
        queueOptions: {
          durable: false
        },
      },
    },
  ]),],
  controllers: [PaymentController, PaymentStoreController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
