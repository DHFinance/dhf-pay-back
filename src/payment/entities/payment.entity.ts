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
  @ApiProperty({type: () => Stores,
    description: 'Магазин, которому принадлежит платеж, можно указывать id или сам объект',
    default: 2,})
  store: Stores;

  @OneToMany(() => Transaction, (transactions) => transactions.payment)
  @ApiProperty({type: () => Transaction,
    description: 'Транзакции, совершенные по реквизитам этого платежа, можно указывать id или сам объект',
    default: 2
  })
  transactions: Transaction[];

  @Column()
  datetime: Date;

  @Column({type: 'bigint'})
  @ApiProperty({
    description: 'Количество токенов, необходимых, чтобы закрыть платеж',
    default: '2500000000',
  })
  amount: string;

  @Column()
  @ApiProperty({
    description: 'Статус платежа Not_paid при создании, Particularly_paid если оплачен не полностью (возможно в теории), Paid - оплачен полностью',
    default: 'Not_paid',
  })
  status: 'Not_paid' | 'Particularly_paid' | 'Paid';

  @Column()
  @ApiProperty({
    description: 'Комментарий к платежу',
    default: 'Tips',
  })
  comment: string;

  @Column({nullable: true})
  @ApiProperty({
    description: 'Номер шаблона кнопки, привязанной к платежу (если у платежа есть кнопка)',
    default: 1,
  })
  type: number;

  @Column({nullable: true})
  @ApiProperty({
    description: 'Текст кнопки, привязанной к платежу (если у платежа есть кнопка)',
    default: 'Pay',
  })
  text: string;
}
