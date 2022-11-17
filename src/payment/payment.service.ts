import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Err, Ok, Result } from 'oxide.ts';
import { BaseError } from '../common/base-classes/base-error';
import { Stores } from '../stores/entities/stores.entity';
import { StoreNotFoundError } from '../stores/errors/store-not-found.error';
import { CreatePaymentResponseDto } from './dto/create-payment.response-dto';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentService extends TypeOrmCrudService<Payment> {
  constructor(
    @InjectRepository(Payment) repo,
    private mailerService: MailerService,
  ) {
    super(repo);
  }

  async sendMailBill(billMailDto) {
    const payment = await this.repo.findOne({
      where: {
        id: billMailDto.id,
      },
      relations: ['store'],
    });

    await this.mailerService.sendMail({
      to: billMailDto.email,
      from: process.env.MAILER_EMAIL,
      subject: `Payment to store ${payment.store.name}`,
      template: 'send-mail-bill',
      context: {
        email: billMailDto.email,
        billUrl: billMailDto.billUrl,
        store: payment.store.name,
        comment: payment.comment,
        amount: payment.amount,
      },
    });
  }

  async save(dto) {
    return this.repo.save({ ...dto, cancelled: true });
  }

  async create(
    dto,
    apiKey,
  ): Promise<Result<CreatePaymentResponseDto, BaseError>> {
    const store = await Stores.findOne({
      where: {
        apiKey: apiKey,
      },
    });
    if (!store) {
      return Err(new StoreNotFoundError());
    }

    const newPayment = await this.repo.create({
      amount: (dto.amount * 1_000_000_000).toString(),
      store,
      comment: dto.comment || '',
      text: dto.text || '',
      currency: dto.currency,
      type: dto.type || null,
    });

    const newPaymentInDB = await this.repo.save(newPayment);
    return Ok({ id: newPaymentInDB.id });
  }

  async findPayment(id) {
    return await this.repo.findOne({
      where: {
        id: id,
      },
      relations: ['store', 'store.user'],
    });
  }

  async findById(id) {
    const payment = await this.repo.findOne({
      where: {
        id: id,
      },
      relations: ['store', 'store.wallets'],
    });
    if (!payment) {
      throw new HttpException('payment nof found', HttpStatus.NOT_FOUND);
    }

    return {
      id: payment.id,
      datetime: payment.datetime,
      amount: payment.amount,
      status: payment.status,
      comment: payment.comment,
      type: payment.type,
      text: payment.text,
      cancelled: payment.cancelled,
      currency: payment.currency,
      store: {
        id: payment.store.id,
        wallets: payment.store.wallets.map((wallet) => ({
          value: wallet.value,
          currency: wallet.currency,
        })),
      },
    };
  }
}
