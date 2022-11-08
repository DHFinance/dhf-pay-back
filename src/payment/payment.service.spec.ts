import { Connection, Repository } from 'typeorm';
import { StoresService } from '../stores/stores.service';
import { HttpService } from '@nestjs/axios';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';

const nodemailerMock = require('nodemailer-mock');
import { createMemDB } from '../utils/createMemDB';
import { Stores } from '../stores/entities/stores.entity';
import { User } from '../user/entities/user.entity';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';
import { Transaction } from '../transaction/entities/transaction.entity';
import { TransactionService } from '../transaction/transaction.service';

describe('Payment Service', () => {
  let db: Connection;
  let paymentService: PaymentService;
  let paymentRepo: Repository<Payment>;
  let transactionService: TransactionService;
  let storesService: StoresService;
  let transactionRepo: Repository<Transaction>;
  let httpService: HttpService;
  let mailerService: any;

  beforeAll(async () => {
    const transport = nodemailerMock.createTransport({
      host: '127.0.0.1',
      port: -100,
    });

    db = await createMemDB([Transaction, Stores, User, Payment]);
    transactionRepo = await db.getRepository(Transaction);
    httpService = new HttpService();
    // mailerService = new MailerService({
    //     transport: transport
    //
    // })
    mailerService = {};

    mailerService.sendMail = jest.fn();

    transactionService = new TransactionService(
      transactionRepo,
      paymentService,
      storesService,
      httpService,
      mailerService,
    );
    paymentRepo = await db.getRepository(Payment);
    transactionRepo = await db.getRepository(Transaction);
    transactionService = new TransactionService(
      transactionRepo,
      paymentService,
      storesService,
      httpService,
      mailerService,
    );

    paymentService = new PaymentService(paymentRepo, mailerService);
  });

  afterAll(() => db.close());

  it('should create a payment', async () => {
    const user = {
      name: 'TestName',
      lastName: 'TestLastName',
      email: 'mail@gmail.com',
      token: '$2b$07$PUx7RK/NjXwo7i9xpYT2vejPjU3A4hxCCvYYkDbZ/fcfgyFnCw9f.',
      role: 'customer',
      password: '5ZlEqFyVD4XMnxJsSFZf2Yra1k3m44o1E59v',
      company: 'mail.ru',
      blocked: false,
      loginAttempts: 0,
      timeBlockLogin: null,
    };

    const userEntity = User.create(user);
    const newUser = await userEntity.save();
    expect(newUser).toHaveProperty('id');

    const apiKey = 'a1OhgujaZx7TQYJGOaXTrKSzYeG4LTu9GmTTk';
    const store = {
      name: 'Store test',
      description: 'Good store',
      url: 'https://lms.sfedu.ru/my/',
      apiKey: apiKey,
      user: newUser,
      wallet:
        '01acdbbd933fd7aaedb7b1bd29c577027d86b5fafc422267a89fc386b7ebf420c9',
    };

    const payment = {
      amount: '2500000000',
      status: 'Not_paid',
      comment: 'test comment',
      cancelled: false,
    };

    const newStore = await Stores.create(store);
    await newStore.save();

    const newPayment = await paymentService.create(payment, newStore.apiKey);
    expect(newPayment).toHaveProperty('id');
    expect(newPayment.status).toEqual('Not_paid');
    expect(newPayment.amount).toEqual('2500000000');
    expect(newPayment.comment).toEqual('test comment');
  });
});
