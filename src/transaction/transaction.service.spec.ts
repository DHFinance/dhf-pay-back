import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import {ConfigModule, ConfigService} from "nestjs-config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {MailerModule, MailerService} from "@nest-modules/mailer";
import * as path from "path";
import {StoresService} from "../stores/stores.service";
import {HttpModule, HttpService} from "@nestjs/axios";
import {Transaction} from "./entities/transaction.entity";
import {Stores} from "../stores/entities/stores.entity";
import {UserModule} from "../user/user.module";
import {UserService} from "../user/user.service";
import {StoresModule} from "../stores/stores.module";
import {TransactionController} from "./transaction.controller";

const dotEnvPath = path.resolve(__dirname, '..', '.env');

const transaction = {
  "status": "processing",
  "email": "ermachenkovvova@gmail.com",
  "txHash": "16ae42729a88a4df9519a8e08807d68856070d93cf162898948b7de57e1a3368",
  "payment": {
    id:142,
    amount: "2500000000"
  },
  "sender": "01acdbbd933fd7aaedb7b1bd29c577027d86b5fafc422267a89fc386b7ebf420c9",
}

describe('TransactionService', () => {
  let service: TransactionService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.load(
            path.resolve(__dirname, 'config', '**!(*.d).config.{ts,js}'),
            {
              path: dotEnvPath,
            },
        ), //ci
        TypeOrmModule.forRootAsync({
          useFactory: (config: ConfigService) => {
            return {
              ...config.get('database.config'),
              entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
            };
          },
          inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([Transaction, Stores]),
       MailerModule
      ],
      providers: [
        TransactionService,StoresService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(async () => {
            }),
            // really it can be anything, but the closer to your actual logic the better
          }
        },
        {
          provide: MailerService,
          useValue: {
            get: jest.fn(async () => {
            }),
            // really it can be anything, but the closer to your actual logic the better
          }
        }
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    mailerService = module.get<MailerService>(MailerService);

  });

  it('create transaction', async () => {
    const createdTransaction = await service.create(transaction);
    const res = Transaction.findOne({
      id: createdTransaction.id
    });

    expect(res).toBeDefined();
  });

  it('should get error the same transaction', async () => {
    const res = await Transaction.findOne({
      where: {
        email: transaction.email
      }
    });

    expect(async ()=> await service.create(transaction)).rejects.toThrow();

    // @ts-ignore
    await Transaction.remove({...res});
  });

});
