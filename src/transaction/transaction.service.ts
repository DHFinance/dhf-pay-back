import { MailerService } from '@nestjs-modules/mailer';
import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import * as BlockIo from 'block_io';
import { CurrencyType } from '../currency/currency.enum';
import { Payment } from '../payment/entities/payment.entity';
import { PaymentService } from '../payment/payment.service';
import { StoresService } from '../stores/stores.service';
import { GenerateTransactionWithWalletRequestDto } from './dto/generate-transaction-with-wallet.request.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService extends TypeOrmCrudService<Transaction> {
  constructor(
    @InjectRepository(Transaction) repo,
    private readonly paymentService: PaymentService,
    private readonly storesService: StoresService,
    private httpService: HttpService,
    private mailerService: MailerService,
  ) {
    super(repo);
  }

  async sendMail(transaction) {
    try {
      await this.mailerService.sendMail({
        to: transaction.email,
        from: process.env.MAILER_EMAIL,
        subject: `Payment to store ${transaction.payment.store.name}`,
        template: 'create-transaction',
        context: {
          email: transaction.email,
          store: transaction.payment.store.name,
          status: transaction.status,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  async create(transaction) {
    const findTransaction = await this.repo.findOne({
      where: {
        txHash: transaction.txHash,
      },
    });

    if (findTransaction) {
      throw new HttpException(
        'transaction already exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const findPayment = await Payment.findOne({
      where: {
        id: transaction.payment.id,
      },
    });

    if (!findPayment) {
      throw new HttpException('payment ID incorrect', HttpStatus.BAD_REQUEST);
    }

    if (findPayment.type === null && findPayment.status === 'Paid') {
      throw new HttpException(
        'payment already completed',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (findPayment.cancelled) {
      throw new HttpException(
        'payment already cancelled',
        HttpStatus.BAD_REQUEST,
      );
    }

    const res = await this.repo.save({
      ...transaction,
      amount: findPayment.amount.toString(),
      status: 'processing',
      updated: new Date(),
      payment: findPayment,
    });
    const sendTransaction = {
      id: res.id,
      email: res.email,
      txHash: res.txHash,
      sender: res.sender,
      amount: res.amount,
      status: res.status,
      payment: {
        id: res.payment.id,
        datetime: res.payment.datetime,
        status: res.payment.status,
        store: {
          id: res.payment.store.id,
        },
      },
    };
    try {
      await this.sendMail(res);
    } catch (e) {
      console.log(e);
    }
    return sendTransaction;
  }

  async createNewWithWallet(dto: GenerateTransactionWithWalletRequestDto) {
    const paymentInDB = await this.paymentService.findPayment(dto.paymentId);

    if (!paymentInDB) {
      throw new HttpException('Payment not found', HttpStatus.BAD_REQUEST);
    }

    if (
      !(
        paymentInDB.currency === CurrencyType.Doge ||
        paymentInDB.currency === CurrencyType.Bitcoin
      )
    ) {
      throw new HttpException('Currency not found', HttpStatus.BAD_REQUEST);
    }

    let block_io;

    if (paymentInDB.currency === CurrencyType.Doge) {
      block_io = new BlockIo('78d9-8f79-105e-5e78');
    }

    if (paymentInDB.currency === CurrencyType.Bitcoin) {
      block_io = new BlockIo('b5b1-5b2d-4889-efb4');
    }

    const newWallet = await block_io?.get_new_address();

    if (newWallet.status !== 'success') {
      return;
    }

    const newWalletData = newWallet.data.address;

    const newTransaction = this.repo.create({
      payment: paymentInDB,
      walletForTransaction: newWalletData,
      amount: paymentInDB.amount,
      status: 'wallet_created',
      updated: new Date(),
    });

    const newTransactionInDB = await this.repo.save(newTransaction);

    return newTransactionInDB;
  }
}
