import { Body, Controller, Get, Headers, HttpException, HttpStatus, Inject, Param, Post } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { ClientProxy } from "@nestjs/microservices";
import { UserService } from "../user/user.service";
import { ApiBearerAuth, ApiProperty, ApiTags } from "@nestjs/swagger";
import { ChangePasswordDto } from "../auth/dto/reset.dto";
import { BillMailDto } from "./dto/billMail.dto";

@ApiTags('store payment')
@Controller('/payment')
@ApiBearerAuth('Bearer')
export class PaymentStoreController {

  constructor(
    public readonly service: PaymentService,
    public readonly userService: UserService,
    @Inject('PAYMENT_SERVICE') private readonly client: ClientProxy
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

