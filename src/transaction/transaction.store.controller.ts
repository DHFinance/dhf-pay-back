import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { TransactionService } from './transaction.service';

@ApiTags('transaction store')
@Controller('transaction')
@ApiBearerAuth('Bearer')
export class TransactionStoreController {
  constructor(
    public readonly service: TransactionService,
    public readonly userService: UserService,
  ) {}
}
