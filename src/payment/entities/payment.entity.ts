import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CurrencyType } from '../../currency/currency.enum';
import { Stores } from '../../stores/entities/stores.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';

export enum Status {
  Not_paid = 'Not_paid',
  Paid = 'Paid',
  Particularly_paid = 'Particularly_paid',
}

@Entity()
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Stores, (store) => store, {
    eager: true,
  })
  @ApiProperty({
    type: () => Stores,
    description:
      'The store to which the payment belongs, you can specify the id or the object itself',
    default: {
      id: 1,
      wallets: {
        value: 'wallet',
        currency: CurrencyType.Casper,
      },
    },
  })
  store: Stores;

  @OneToMany(() => Transaction, (transactions) => transactions.payment)
  transactions: Transaction[];

  @CreateDateColumn()
  datetime: Date;

  @Column({ type: 'bigint' })
  @ApiProperty({
    description: 'Number of tokens needed to close the payment',
    default: '2500000000',
  })
  amount: string;

  @Column({ default: 'Not_paid' })
  @ApiProperty({
    description:
      'Payment status Not_paid when creating, Particularly_paid if not paid in full (maybe in theory), Paid - paid in full',
    default: Status.Not_paid,
  })
  status: Status;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Payment comment',
    default: 'Tips',
  })
  comment: string;

  @Column({ nullable: true })
  @ApiProperty({
    description:
      'Button template number associated with the payment (if the payment has a button)',
    default: 1,
  })
  type: number;

  @Column({ nullable: true })
  @ApiProperty({
    description:
      'The text of the button associated with the payment (if the payment has a button)',
    default: 'Pay',
  })
  text: string;

  @Column({ default: false })
  @ApiProperty({
    default: false,
  })
  cancelled: boolean;

  @Column({ enum: CurrencyType, default: CurrencyType.Casper })
  @ApiProperty({
    default: CurrencyType.Casper,
  })
  currency: CurrencyType;
}
