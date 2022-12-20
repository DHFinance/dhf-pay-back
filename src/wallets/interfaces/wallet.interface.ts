import { CurrencyType } from '../../currency/currency.enum';

interface Wallet {
  value: string;
  currency: CurrencyType;
}

export type { Wallet };
