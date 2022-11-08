import { HttpService } from '@nestjs/axios';
import { Connection, Repository } from 'typeorm';
import { Payment, Status } from '../payment/entities/payment.entity';
import { PaymentService } from '../payment/payment.service';
import { Stores } from '../stores/entities/stores.entity';
import { StoresService } from '../stores/stores.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { createMemDB } from '../utils/createMemDB';
import { Transaction } from './entities/transaction.entity';
import { TransactionService } from './transaction.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailerMock = require('nodemailer-mock');

describe('Transaction Service', () => {
  let db: Connection;
  let transactionService: TransactionService;
  let paymentService: PaymentService;
  let userService: UserService;
  let storesService: StoresService;
  let transactionRepo: Repository<Transaction>;
  let storesRepo: Repository<Stores>;
  let httpService: HttpService;
  let mailerService: any;

  beforeAll(async () => {
    nodemailerMock.createTransport({
      host: '127.0.0.1',
      port: -100,
    });

    db = await createMemDB([Transaction, Stores, User, Payment]);
    transactionRepo = await db.getRepository(Transaction);
    storesRepo = await db.getRepository(Stores);
    storesService = new StoresService(storesRepo, userService);
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

    await Transaction.delete({});
  });

  afterAll(() => db.close());

  it('should create a transaction', async () => {
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

    const newStore = await Stores.create(store);
    await newStore.save();

    const payment = {
      datetime: new Date(),
      type: null,
      text: '',
      amount: '2500000000',
      status: Status.Not_paid,
      comment: 'test comment',
      cancelled: false,
      store: newStore,
    };

    const paymentEntity = await Payment.create(payment);
    const newPayment = await paymentEntity.save();
    expect(newPayment).toHaveProperty('id');

    const transaction = {
      status: 'processing',
      email: 'ermachenkovvova@gmail.com',
      amount: newPayment.amount,
      txHash:
        '16ae42729a88a4df9519a8e08807d68856070d93cf162898948b7de57e1a3368',
      sender:
        '01acdbbd933fd7aaedb7b1bd29c577027d86b5fafc422267a89fc386b7ebf420c9',
      updated: new Date(),
      payment: newPayment,
    };

    const newTransaction = await transactionService.create(transaction);

    expect(newTransaction).toHaveProperty('id');
    expect(newTransaction.status).toEqual('processing');
    expect(newTransaction.email).toEqual('ermachenkovvova@gmail.com');
    expect(newTransaction.amount).toEqual('2500000000');
    expect(newTransaction.txHash).toEqual(
      '16ae42729a88a4df9519a8e08807d68856070d93cf162898948b7de57e1a3368',
    );
    expect(newTransaction.sender).toEqual(
      '01acdbbd933fd7aaedb7b1bd29c577027d86b5fafc422267a89fc386b7ebf420c9',
    );
  });
});
