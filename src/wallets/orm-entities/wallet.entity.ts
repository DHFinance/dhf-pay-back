import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CurrencyType } from '../../currency/currency.enum';
import { Stores } from '../../stores/entities/stores.entity';

@Entity()
class WalletOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Stores, (store) => store.wallets)
  store: Stores;

  @Column({ enum: CurrencyType })
  currency: CurrencyType;

  @Column()
  value: string;
}

export { WalletOrmEntity };
