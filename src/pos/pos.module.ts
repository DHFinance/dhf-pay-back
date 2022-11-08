import { Module } from '@nestjs/common';
import { PosController } from './pos.controller';

@Module({
  controllers: [PosController],
})
class PosModule {}

export { PosModule };
