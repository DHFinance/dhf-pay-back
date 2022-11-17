import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletOrmEntity } from '../wallets/orm-entities/wallet.entity';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { Stores } from './entities/stores.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Stores, WalletOrmEntity]), UserModule],
  controllers: [StoresController],
  providers: [StoresService],
  exports: [StoresService],
})
export class StoresModule {}
