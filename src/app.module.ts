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
// import { HandlebarsAdapter, MailerModule } from "@nest-modules/mailer";
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import {  MailerModule } from "@nestjs-modules/mailer";
import { StoresModule } from "./stores/stores.module";
const isProduction = process.env.npm_lifecycle_event === 'start:prod';
const dotEnvPath = isProduction
  ? path.resolve(__dirname, '..', '.env.staging')
  : path.resolve(__dirname, '..', '.env');
// console.log(process.env.npm_lifecycle_event);
const env = require('dotenv').config().parsed
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
    MailerModule.forRoot({
      transport: {
        host: env.MAILER_HOST,
        SSL: !!env.MAILER_SSL,
        QAuth: !!env.MAILER_QAUTH,
        port: env.MAILER_PORT,
        auth: {
          user: env.MAILER_EMAIL,
          pass: env.MAILER_PASSWORD,
        },
      },
      template: {
        dir: __dirname + '/../src/mail-templates',
        adapter: new HandlebarsAdapter(), // or new PugAdapter()
        options: {
          strict: true,
        },
      },
    }),
    UserModule,
    AuthModule,
    PaymentModule,
    TransactionModule,
    StoresModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
