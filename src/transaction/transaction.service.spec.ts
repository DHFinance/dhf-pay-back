import {Connection, Repository} from 'typeorm'
import {TransactionService} from './transaction.service';
import {StoresService} from "../stores/stores.service";
import {HttpService} from "@nestjs/axios";
import {MailerService} from "@nest-modules/mailer";
const nodemailerMock = require('nodemailer-mock');
import {createMemDB} from "../utils/createMemDB";
import {Transaction} from "./entities/transaction.entity";
import {Stores} from "../stores/entities/stores.entity";
import {User} from "../user/entities/user.entity";
import {Payment} from "../payment/entities/payment.entity";

describe('Transaction Service', () => {
    let db: Connection
    let transactionService: TransactionService
    let storesService: StoresService
    let transactionRepo: Repository<Transaction>
    let storesRepo: Repository<Stores>
    let httpService: HttpService
    let mailerService: MailerService

    beforeAll(async () => {
        const transport = nodemailerMock.createTransport({
            host: '127.0.0.1',
            port: -100,
        });

        db = await createMemDB([Transaction, Stores, User, Payment])
        transactionRepo = await db.getRepository(Transaction)
        storesRepo = await db.getRepository(Stores)
        storesService = new StoresService(storesRepo)
        httpService = new HttpService();
        mailerService = new MailerService({
            transport: transport

        })
        transactionService = new TransactionService(transactionRepo, storesService, httpService, mailerService)

        await Transaction.delete({})

    })

    afterAll(() => db.close())

    it('should create a transaction', async () => {


        const transaction = {
            "status": "processing",
            "email": "ermachenkovvova@gmail.com",
            "txHash": "16ae42729a88a4df9519a8e08807d68856070d93cf162898948b7de57e1a3368",
            "sender": "01acdbbd933fd7aaedb7b1bd29c577027d86b5fafc422267a89fc386b7ebf420c9",

        }

        const newTransaction = await transactionService.create(transaction);

        expect(newTransaction).toHaveProperty("id")
        expect(newTransaction.status).toEqual("processing")
        expect(newTransaction.email).toEqual("ermachenkovvova@gmail.com")
        expect(newTransaction.txHash).toEqual("16ae42729a88a4df9519a8e08807d68856070d93cf162898948b7de57e1a3368")
        expect(newTransaction.sender).toEqual("01acdbbd933fd7aaedb7b1bd29c577027d86b5fafc422267a89fc386b7ebf420c9")

    })
})