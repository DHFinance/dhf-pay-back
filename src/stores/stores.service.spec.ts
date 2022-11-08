import { HttpService } from '@nestjs/axios';
import { Connection, Repository } from 'typeorm';
import { Payment } from '../payment/entities/payment.entity';
import { PaymentService } from '../payment/payment.service';
import { StoresService } from '../stores/stores.service';
import { Transaction } from '../transaction/entities/transaction.entity';
import { TransactionService } from '../transaction/transaction.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { createMemDB } from '../utils/createMemDB';
import { Stores } from './entities/stores.entity';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailerMock = require('nodemailer-mock');

describe('Store Service', () => {
  let db: Connection;
  let paymentService: PaymentService;
  let userService: UserService;
  let paymentRepo: Repository<Payment>;
  let storeRepo: Repository<Stores>;
  let userRepo: Repository<User>;
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
    httpService = new HttpService();
    // mailerService = new MailerService({
    //     transport: transport
    //
    // })

    mailerService = {};

    mailerService.sendMail = jest.fn();

    transactionRepo = await db.getRepository(Transaction);
    paymentRepo = await db.getRepository(Payment);
    transactionRepo = await db.getRepository(Transaction);
    storeRepo = await db.getRepository(Stores);
    await db.getRepository(User);

    new TransactionService(
      transactionRepo,
      paymentService,
      storesService,
      httpService,
      mailerService,
    );
    paymentService = new PaymentService(paymentRepo, mailerService);
    storesService = new StoresService(storeRepo, userService);

    await Stores.delete({});
  });

  afterAll(() => db.close());

  it('should change blocked status', async () => {
    const user = {
      name: '1',
      lastName: '1',
      email: 'mail@gmail.com',
      token: '$2b$07$PUx7RK/NjXwo7i9xpYT2vejPjU3A4hxCCvYYkDbZ/fcfgyFnCw9f.',
      role: 'customer',
      // id: 60,
      password: '5ZlEqFyVD4XMnxJsSFZf2Yra1k3m44o1E59v',
      company: 'mail.ru',
      blocked: false,
      loginAttempts: 0,
      timeBlockLogin: null,
    };

    const userEntity = User.create(user);
    const newUser = await userEntity.save();
    expect(newUser).toHaveProperty('id');

    const store = {
      name: 'Store test',
      description: 'Good store',
      url: 'https://lms.sfedu.ru/my/',
      apiKey: 'FL1f0BNoBB3qRQ4dKtzwNgmdT95qJniM89Ak123',
      user: newUser,
      wallet:
        '01acdbbd933fd7aaedb7b1bd29c577027d86b5fafc422267a89fc386b7ebf420c9',
    };

    const newStore = await Stores.create(store);
    await newStore.save();

    expect(newStore).toHaveProperty('blocked', false);
    const updatedStore = await storesService.changeBlockStore(
      newStore.id,
      true,
    );
    expect(updatedStore).toHaveProperty('blocked', true);
    expect(newStore).toHaveProperty('id');
  });

  it('should validate unblocked store', async () => {
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

    const apiKey = 'FL1f0BNoBB3qRQ4dKtzwNgmdT95qJniM89Ak123uniq';
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

    expect(newStore).toHaveProperty('blocked', false);

    const validStore = await storesService.validateStore(apiKey);

    expect(validStore).toHaveProperty('id', newStore.id);

    const updatedStore = await storesService.changeBlockStore(
      validStore.id,
      true,
    );
    expect(updatedStore).toHaveProperty('blocked', true);

    try {
      await storesService.validateStore(apiKey);
    } catch (e) {
      expect(e).toHaveProperty('message', 'store');
    }

    await expect(
      async () => await storesService.validateStore(store.apiKey),
    ).rejects.toThrow();
  });
});
