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
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Stores, store => store, {
    eager: true,
  })
  @ApiProperty({type: () => Stores})
  store: Stores;

  @OneToMany(() => Transaction, (transactions) => transactions.payment)
  @ApiProperty({type: () => Transaction})
  transactions: Transaction[];

  @Column()
  datetime: Date;

  @Column({type: 'bigint'})
  @ApiProperty()
  amount: string;

  @Column()
  @ApiProperty()
  status: 'Not_paid' | 'Particularly_paid' | 'Paid';

  @Column()
  @ApiProperty()
  comment: string;

  @Column({nullable: true})
  @ApiProperty()
  type: number;

  @Column({nullable: true})
  @ApiProperty()
  text: string;
}
