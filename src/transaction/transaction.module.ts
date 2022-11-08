import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { TransactionStoreController } from './transaction.store.controller';
import { StoresModule } from '../stores/stores.module';
import { UserModule } from '../user/user.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    StoresModule,
    PaymentModule,
    UserModule,
    HttpModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [TransactionController, TransactionStoreController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
