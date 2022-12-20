import { IsInt } from 'class-validator';

class GenerateTransactionWithWalletRequestDto {
  @IsInt()
  paymentId: number;
}

export { GenerateTransactionWithWalletRequestDto };
