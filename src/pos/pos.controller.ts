import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Status } from '../payment/entities/payment.entity';
import { CreatePaymentWithPosTerminalRequest } from './dtos/createPaymentWithPosTerminal.request';
import { CreatePaymentWithPosTerminalResponse } from './dtos/createPaymentWithPosTerminal.response';
import { GetPosTerminalInfoResponseDto } from './dtos/getPosTerminalInfo.response.dto';
import { LoginPosTerminalRequestDto } from './dtos/loginPosTerminal.request.dto';
import { LoginPosTerminalResponseDto } from './dtos/loginPosTerminal.response.dto';
import { LoginPosTerminalWithQRRequest } from './dtos/loginPosTerminalWithQR.request';
import { LoginPosTerminalWithQRResponse } from './dtos/loginPosTerminalWithQR.response';

@Controller('merchant/pos')
@ApiTags('pos')
class PosController {
  @Post('auth')
  @ApiOperation({
    summary: 'Login POS terminal',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Wrong login or password',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return jwt token',
    type: LoginPosTerminalResponseDto,
  })
  async loginPosTerminal(
    @Body() dto: LoginPosTerminalRequestDto,
  ): Promise<LoginPosTerminalResponseDto> {
    const testJwtToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    return { token: testJwtToken };
  }

  @Post('authqr')
  @ApiOperation({
    summary: 'Login POS terminal with QR',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Wrong code',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return jwt token',
    type: LoginPosTerminalWithQRResponse,
  })
  async loginPosTerminalWithQR(
    @Body() dto: LoginPosTerminalWithQRRequest,
  ): Promise<LoginPosTerminalWithQRResponse> {
    const testJwtToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    return { token: testJwtToken };
  }

  @Post('logout')
  @ApiBearerAuth('Bearer')
  @ApiOperation({
    summary: 'Logout POS terminal',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authorization error',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Return true',
    type: LoginPosTerminalWithQRResponse,
  })
  async logout(): Promise<true> {
    return true;
  }

  @Get()
  @ApiBearerAuth('Bearer')
  @ApiOperation({
    summary: 'Get info about the POS terminal',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authorization error',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Return POS terminal info',
    type: LoginPosTerminalWithQRResponse,
  })
  async getPosInfo(): Promise<GetPosTerminalInfoResponseDto> {
    return {
      id: 1,
      name: 'test-pos',
      store: {
        id: 2,
        name: 'test-store',
      },
      logo: 'link-to-logo',
    };
  }

  @Post('payment')
  @ApiBearerAuth('Bearer')
  @ApiOperation({
    summary: 'Create payment with Pos',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authorization error',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Wrong amount or devise',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return payment info',
    type: CreatePaymentWithPosTerminalResponse,
  })
  async createPaymentWithPosTerminal(
    @Body() dto: CreatePaymentWithPosTerminalRequest,
  ): Promise<CreatePaymentWithPosTerminalResponse> {
    return {
      id: 1,
      store: {
        id: 2,
        name: 'test-store',
      },
      amount: '25000000',
      currency: 'USDT',
      status: Status.Not_paid,
      description: 'This is the test payment',
    };
  }
}

export { PosController };
