import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BearerStrategy } from './bearer.strategy';
import { UserModule } from '../user/user.module';
import { StoresModule } from '../stores/stores.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [UserModule, StoresModule, HttpModule],
  controllers: [AuthController],
  providers: [AuthService, BearerStrategy],
  exports: [BearerStrategy],
})
export class AuthModule {}
