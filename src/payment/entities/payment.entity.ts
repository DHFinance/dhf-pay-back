import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne, OneToMany, CreateDateColumn
} from "typeorm";
import { User } from '../../user/entities/user.entity';
import { Transaction } from "../../transaction/entities/transaction.entity";
import { Stores } from "../../stores/entities/stores.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Stores, store => store, {
    eager: true,
  })
  @ApiProperty({type: () => Stores,
    description: 'The store to which the payment belongs, you can specify the id or the object itself',
    default: 2,})
  store: Stores;

  @OneToMany(() => Transaction, (transactions) => transactions.payment)
  transactions: Transaction[];

  @CreateDateColumn()
  datetime: Date;

  @Column({type: 'bigint'})
  @ApiProperty({
    description: 'Number of tokens needed to close the payment',
    default: '2500000000',
  })
  amount: string;

  @Column()
  @ApiProperty({
    description: 'Payment status Not_paid when creating, Particularly_paid if not paid in full (maybe in theory), Paid - paid in full',
    default: 'Not_paid',
  })
  status: 'Not_paid' | 'Particularly_paid' | 'Paid';

  @Column()
  @ApiProperty({
    description: 'Payment comment',
    default: 'Tips',
  })
  comment: string;

  @Column({nullable: true})
  @ApiProperty({
    description: 'Button template number associated with the payment (if the payment has a button)',
    default: 1,
  })
  type: number;

  @Column({nullable: true})
  @ApiProperty({
    description: 'The text of the button associated with the payment (if the payment has a button)',
    default: 'Pay',
  })
  text: string;
}
