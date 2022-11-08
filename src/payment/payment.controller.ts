import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CrudController, Override } from '@nestjsx/crud';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import { CreateOnePaymentDto } from './dto/createOnePayment.dto';
import { GetPaymentDto } from './dto/getPayment.dto';
import { ReturnCancelledPaymentDto } from './dto/returnCancelledPayment.dto';
import {
  returnCreatePaymentDto,
  ReturnPaymentDto,
} from './dto/returnPayment.dto';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';

@ApiTags('payment')
@Controller('payment')
@ApiBearerAuth('Bearer')
export class PaymentController implements CrudController<Payment> {
  constructor(
    public readonly service: PaymentService,
    public readonly userService: UserService,
    @Inject('PAYMENT_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Override()
  @Get()
  @ApiOperation({
    summary: 'Get all payment for store',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'not found Bearer token',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'This store does not have such a payments',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: '',
    type: ReturnPaymentDto,
  })
  @ApiHeader({
    name: 'apiKey store',
    description: 'Bearer sgRcXvaZrsd0NNxartp09RFFApSRq8E8g1lc',
  })
  async getAllByStore(@Headers() headers) {
    /**
     * @description if Authorization is not specified or there is no store with such apiKey, then an array with all entries is returned. If a store with such apiKey exists, returns an array of payments that depend on this store
     */
    if (!headers['authorization']) {
      throw new HttpException('not found Bearer token', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.findByToken(
      headers['authorization'].split(' ')[1],
    );
    if (user?.role === 'admin') {
      return await this.service.find({
        relations: ['store'],
      });
    }
    try {
      const payments = await this.service.find({
        where: {
          store: {
            apiKey: headers.authorization.split(' ')[1],
          },
        },
        relations: ['store'],
      });
      return payments;
    } catch (err) {
      throw new HttpException(
        'This store does not have such a payments',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Override()
  @Patch(':id')
  @ApiOperation({
    summary: 'Update payment by id',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error',
  })
  async updatePatchPayment() {
    throw new HttpException('Error', HttpStatus.BAD_REQUEST);
  }

  @Override()
  @Put('cancel/:id')
  @ApiOperation({
    summary: 'Change cancelled status',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'user not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'you cant change cancel status',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: ReturnCancelledPaymentDto,
  })
  @ApiHeader({
    name: 'Bearer token',
    description: 'Bearer sgRcXvaZrsd0NNxartp09RFFApSRq8E8g1lc',
  })
  async updateCancelledStatus(@Param() id, @Headers() token) {
    if (!token.authorization) {
      throw new HttpException('token not found', HttpStatus.UNAUTHORIZED);
    }
    const user = await this.userService.findByToken(
      token.authorization.split(' ')[1],
    );
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    const payment = await this.service.findPayment(id.id);
    if (!payment) {
      throw new HttpException('payment not found', HttpStatus.NOT_FOUND);
    }
    if (payment.status === 'Paid') {
      throw new HttpException(
        'payment already completed',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (user.token === payment.store.user.token) {
      const res = await this.service.save(payment);
      return {
        id: res.id,
        datetime: res.datetime,
        amount: res.amount,
        status: res.status,
        comment: res.comment,
        type: res.type,
        text: res.text,
        cancelled: res.cancelled,
      };
    }
    throw new HttpException(
      'you cant change cancel status',
      HttpStatus.CONFLICT,
    );
  }

  @Override()
  @Put(':id')
  @ApiOperation({
    summary: 'Update payment by id',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error',
  })
  async updatePutPayment() {
    throw new HttpException('Error', HttpStatus.BAD_REQUEST);
  }

  @Override()
  @Get(':id')
  @ApiOperation({
    summary: 'Get payment by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ReturnPaymentDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'payment not found',
  })
  async getPayment(@Param() id: GetPaymentDto, @Headers() token) {
    if (!token?.authorization) {
      return await this.service.findById(id.id);
    }
    const user = await this.userService.findByTokenSelected(
      token.authorization.split(' ')[1],
    );
    if (user) {
      if (user?.role === 'admin') {
        return await this.service.findPayment(id.id);
      }
    }
    return await this.service.findById(id.id);
  }

  // get base(): CrudController<Payment> {
  //   return this;
  // }

  // @Override()
  // getMany(
  //     @ParsedRequest() req: CrudRequest,
  // ) {
  //   // const user = this.userService.findByToken()
  //   return this.base.getManyBase(req);
  // }

  @Override()
  @Post()
  @ApiOperation({
    summary: 'Create new payment',
  })
  @ApiOkResponse({
    description: 'create one payment',
    type: returnCreatePaymentDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'payment already exists',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'store not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'cant create payment with incorrect status',
  })
  @ApiHeader({
    name: 'apiKey store',
    description: 'Bearer sgRcXvaZrsd0NNxartp09RFFApSRq8E8g1lc',
  })
  async createOne(
    @Body() dto: CreateOnePaymentDto,
    @Headers() headers,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      /**
       * @description all payments are sent to create in dhf-pay-processor using RabbitMQ. After processing on the server, the id of the created payment is returned. The store to which the created payment will be linked is determined by apiKey, which is passed to headers.authorization
       * @data {amount: {number}, comment: {string}, apiKey: {string}}
       * @return {id: {number}}
       */
      const findPayment = await this.service.findOne({
        where: {
          id: dto.id,
        },
      });
      if (findPayment) {
        res.status(HttpStatus.BAD_REQUEST).send('payment already exists');
        return;
      }
      if (dto?.cancelled) {
        if (typeof dto.cancelled !== 'boolean' || dto.cancelled === true) {
          res
            .status(HttpStatus.CONFLICT)
            .send('cant create payment with incorrect status');
          return;
        }
      }
      if (dto?.text) {
        if (typeof dto.text !== 'string' || dto.text.length >= 255) {
          res
            .status(HttpStatus.CONFLICT)
            .send('cant create payment with incorrect comment');
          return;
        }
      }
      dto = {
        ...dto,
        amount: (+dto.amount * 1000000000).toString(),
        cancelled: false,
      };
      const response = await this.service.create(
        dto,
        headers.authorization.slice(7),
      );
      return { id: response.id };
    } catch (err) {
      console.log('error');
      throw new HttpException(err.response, HttpStatus.BAD_REQUEST);
    }
    // return this.base.createOneBase(req, dto);
  }

  // @Override('getOneBase')
  // getOneAndDoStuff(
  //   @ParsedRequest() req: CrudRequest,
  // ) {
  //   return this.base.getOneBase(req);
  // }

  // @Override()
  // createMany(
  //     @ParsedRequest() req: CrudRequest,
  //     @ParsedBody() dto: CreateManyDto<Payment>
  // ) {
  //   return this.base.createManyBase(req, dto);
  // }
  //
  // @Override('updateOneBase')
  // coolFunction(
  //     @ParsedRequest() req: CrudRequest,
  //     @ParsedBody() dto: Payment,
  // ) {
  //   return this.base.updateOneBase(req, dto);
  // }
  //
  // @Override('replaceOneBase')
  // awesomePUT(
  //     @ParsedRequest() req: CrudRequest,
  //     @ParsedBody() dto: Payment,
  // ) {
  //   return this.base.replaceOneBase(req, dto);
  // }
  //
  // @Override()
  // async deleteOne(
  //     @ParsedRequest() req: CrudRequest,
  // ) {
  //   return this.base.deleteOneBase(req);
  // }
}
