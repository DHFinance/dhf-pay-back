import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { HttpModule } from "@nestjs/axios";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), HttpModule, ScheduleModule.forRoot()],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [],
})
export class TransactionModule {}
