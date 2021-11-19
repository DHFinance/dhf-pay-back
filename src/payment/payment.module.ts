import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), ClientsModule.register([
    {
      name: 'PAYMENT_SERVICE',
      transport: Transport.RMQ,
      options: {
        urls: ['amqps://tncqeoap:xg6g86QzZQw0SRnM8Zk6EZwu0_9wb9um@bonobo.rmq.cloudamqp.com/tncqeoap'],
        queue: 'payment_queue',
        queueOptions: {
          durable: false
        },
      },
    },
  ]),],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [],
})
export class PaymentModule {}
