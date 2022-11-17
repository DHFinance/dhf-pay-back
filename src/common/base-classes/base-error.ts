// Libraries
import { HttpStatus } from '@nestjs/common';

abstract class BaseError extends Error {
  private readonly _message: string;
  private readonly _status: HttpStatus;

  protected constructor(message: string, status: HttpStatus) {
    super();
    this._message = message;
    this._status = status;
  }

  get message() {
    return this._message;
  }

  get status() {
    return this._status;
  }
}

export { BaseError };
