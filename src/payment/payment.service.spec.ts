import {Connection, Repository} from 'typeorm'
import {StoresService} from "../stores/stores.service";
import {HttpService} from "@nestjs/axios";
import {MailerModule, MailerService} from "@nestjs-modules/mailer";

const nodemailerMock = require('nodemailer-mock');
import {createMemDB} from "../utils/createMemDB";
import {Stores} from "../stores/entities/stores.entity";
import {User} from "../user/entities/user.entity";
import {Payment} from "./entities/payment.entity";
import {PaymentService} from "./payment.service";
import {Transaction} from "../transaction/entities/transaction.entity";
import {TransactionService} from "../transaction/transaction.service";

describe('Payment Service', () => {
    let db: Connection
    let paymentService: PaymentService
    let paymentRepo: Repository<Payment>
    let transactionService: TransactionService
    let storesService: StoresService
    let transactionRepo: Repository<Transaction>
    let httpService: HttpService
    let mailerService: any

    beforeAll(async () => {
        const transport = nodemailerMock.createTransport({
            host: '127.0.0.1',
            port: -100,
        });



        db = await createMemDB([Transaction, Stores, User, Payment])
        transactionRepo = await db.getRepository(Transaction)
        httpService = new HttpService();
        // mailerService = new MailerService({
        //     transport: transport
        //
        // })
        mailerService = {}

        mailerService.sendMail = jest.fn();

        transactionService = new TransactionService(transactionRepo, storesService, httpService, mailerService)
        paymentRepo = await db.getRepository(Payment)
        transactionRepo = await db.getRepository(Transaction)
        transactionService = new TransactionService(transactionRepo, storesService, httpService, mailerService)


        paymentService = new PaymentService(paymentRepo, transactionService, mailerService)




    })

    afterAll(() => db.close())

    it('should create a payment', async () => {


        const payment = {
            amount: "2500000000",
            status: "Not_paid",
            comment: "test comment"

        }

        const newPayment = await paymentService.create(payment, "apiKey");
        expect(newPayment).toHaveProperty("id")
        expect(newPayment.status).toEqual("Not_paid")
        expect(newPayment.amount).toEqual("2500000000")
        expect(newPayment.comment).toEqual("test comment")

    })
})