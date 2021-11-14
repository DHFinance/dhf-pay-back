import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BearerStrategy } from './bearer.strategy';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, BearerStrategy],
  exports: [BearerStrategy],
})
export class AuthModule {}
