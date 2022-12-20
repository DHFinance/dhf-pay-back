import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  callback(body) {
    return {
      result: 'Callback success',
      body,
    };
  }
}
