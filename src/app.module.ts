import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from 'nestjs-config';
import * as path from 'path';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { TransactionModule } from './transaction/transaction.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
const isProduction = process.env.npm_lifecycle_event === 'start:prod';
const dotEnvPath = isProduction
  ? path.resolve(__dirname, '..', '.env.staging')
  : path.resolve(__dirname, '..', '.env');
console.log(process.env.npm_lifecycle_event);
@Module({
  imports: [
    ConfigModule.load(
      path.resolve(__dirname, 'config', '**!(*.d).config.{ts,js}'),
      {
        path: dotEnvPath,
      },
    ), //ci
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        return {
          ...config.get('database.config'),
          entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    PaymentModule,
    TransactionModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}
