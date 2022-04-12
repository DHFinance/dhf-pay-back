import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Payment} from "./entities/payment.entity";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm";
import {TransactionService} from "../transaction/transaction.service";
import {MailerService} from "@nestjs-modules/mailer";
import {Stores} from "../stores/entities/stores.entity";
import {StoresService} from "../stores/stores.service";

@Injectable()
export class PaymentService extends TypeOrmCrudService<Payment> {
  constructor(@InjectRepository(Payment) repo,
              private readonly transactionService: TransactionService,
              private readonly storeService: StoresService,
              private mailerService: MailerService
  ) {
    super(repo);
  }

  async sendMailBill(billMailDto) {
    const payment = await this.repo.findOne({
      where: {
        id: billMailDto.id
      }, relations: ['store']
    })
    
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

  // @Interval(1000)
  // async getStore(){
  //   const parentParent = await this.repo.findOne({
  //     where: {
  //       store: {
  //         user: 1
  //       }
  //     },
  //     relations: ['store', 'store.user']
  //   })
  //   console.log(parentParent)
  // }

  async create(dto, apiKey) {
    try {
      const store = await Stores.findOne({
        where: {
          apiKey: apiKey
        }
      })
      const payment = await this.repo.save({...dto, status: 'Not_paid', datetime: new Date(), store});
      return payment
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async findById(id, token) {
    const payment = await this.repo.findOne({
      where: {
        id: id
      }, relations: ['store']
    });
    // const store = await this.storeService.getAllStore(token)
    // if (!store.find((el) => el.id === payment.store.id)) {
    //   throw new HttpException('no access to this payment', HttpStatus.CONFLICT)
    // }
    delete payment.store.apiKey
    return payment
  }
}
