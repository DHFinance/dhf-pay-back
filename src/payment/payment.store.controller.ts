import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { BillMailDto } from './dto/billMail.dto';
import { PaymentService } from './payment.service';

@ApiTags('store payment')
@Controller('payment')
@ApiBearerAuth('Bearer')
export class PaymentStoreController {
  constructor(
    public readonly service: PaymentService,
    public readonly userService: UserService,
    @Inject('PAYMENT_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Post('send-mail-bill')
  @ApiProperty({ type: BillMailDto })
  public async sendMailBill(@Body() billMailDto: BillMailDto) {
    try {
      return await this.service.sendMailBill(billMailDto);
    } catch (err) {
      throw new HttpException(err.response, HttpStatus.BAD_REQUEST);
    }
  }
}
