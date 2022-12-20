import { HttpStatus } from '@nestjs/common';
import { BaseError } from '../../common/base-classes/base-error';

class StoreNotFoundError extends BaseError {
  constructor() {
    super('Store does not found', HttpStatus.UNAUTHORIZED);
  }
}

export { StoreNotFoundError };
