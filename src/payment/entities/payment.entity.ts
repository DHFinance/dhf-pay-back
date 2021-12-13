import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne, OneToMany
} from "typeorm";
import { User } from '../../user/entities/user.entity';
import { Transaction } from "../../transaction/entities/transaction.entity";
import { Stores } from "../../stores/entities/stores.entity";

@Entity()
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Stores, store => store)
  store: Stores;

  @OneToMany(() => Transaction, (transactions) => transactions.payment)
  transactions: Transaction[];

  @Column()
  datetime: Date;

  @Column({type: 'bigint'})
  amount: string;

  @Column()
  status: 'Not_paid' | 'Particularly_paid' | 'Paid';

  @Column()
  comment: string;

  @Column()
  wallet: string;
}
