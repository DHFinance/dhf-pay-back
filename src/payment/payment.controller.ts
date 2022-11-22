import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { match, Result } from 'oxide.ts';
import { BaseError } from '../common/base-classes/base-error';
import { UserService } from '../user/user.service';
import { CreatePaymentResponseDto } from './dto/create-payment.response-dto';
import { CreateOnePaymentDto } from './dto/createOnePayment.dto';
import { GetPaymentDto } from './dto/getPayment.dto';
import { ReturnCancelledPaymentDto } from './dto/returnCancelledPayment.dto';
import {
  returnCreatePaymentDto,
  ReturnPaymentDto,
} from './dto/returnPayment.dto';
import { PaymentService } from './payment.service';

@ApiTags('payment')
@Controller('payment')
@ApiBearerAuth('Bearer')
export class PaymentController {
  constructor(
    public readonly _paymentService: PaymentService,
    public readonly _userService: UserService,
  ) {}

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
  async getAllByStore(
    @Headers() headers,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('page', ParseIntPipe) page: number,
  ) {
    if (!headers['authorization']) {
      throw new HttpException('not found Bearer token', HttpStatus.BAD_REQUEST);
    }
    const user = await this._userService.findByToken(
      headers['authorization'].split(' ')[1],
    );
    if (user?.role === 'admin') {
      const payments = await this._paymentService.find({
        relations: ['store'],
        skip: limit * (page - 1),
        take: limit,
      });
      const count = await this._paymentService.count();
      return { payments, count };
    }
    try {
      const payments = await this._paymentService.find({
        where: {
          store: {
            apiKey: headers.authorization.split(' ')[1],
          },
        },
        skip: limit * (page - 1),
        take: limit,
        relations: ['store'],
      });
      const count = await this._paymentService.count({
        where: {
          store: {
            apiKey: headers.authorization.split(' ')[1],
          },
        },
        relations: ['store'],
      });
      return { payments, count };
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'This store does not have such a payments',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

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
    const user = await this._userService.findByToken(
      token.authorization.split(' ')[1],
    );
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    const payment = await this._paymentService.findPayment(id.id);
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
      const res = await this._paymentService.save(payment);
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
      return await this._paymentService.findById(id.id);
    }
    const user = await this._userService.findByTokenSelected(
      token.authorization.split(' ')[1],
    );
    if (user) {
      if (user?.role === 'admin') {
        return await this._paymentService.findPayment(id.id);
      }
    }
    return await this._paymentService.findById(id.id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create new payment',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Payment created',
    type: returnCreatePaymentDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Wrong request data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Store not found',
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
    /**
     * @description all payments are sent to create in dhf-pay-processor using RabbitMQ. After processing on the server, the id of the created payment is returned. The store to which the created payment will be linked is determined by apiKey, which is passed to headers.authorization
     * @data {amount: {number}, comment: {string}, apiKey: {string}}
     * @return {id: {number}}
     */
    const result = await this._paymentService.create(
      dto,
      headers.authorization.slice(7),
    );

    return match<
      Result<CreatePaymentResponseDto, BaseError>,
      CreatePaymentResponseDto | string
    >(result, {
      Ok: (paymentId) => paymentId,
      Err: (error) => {
        res.status(error.status);
        return error.message;
      },
    });
  }
}
