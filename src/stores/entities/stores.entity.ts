import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne, OneToMany
} from "typeorm";
import { User } from '../../user/entities/user.entity';
import { Transaction } from "../../transaction/entities/transaction.entity";
import { Payment } from "../../payment/entities/payment.entity";

@Entity()
export class Stores extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user)
  user: User;

  @OneToMany(() => Payment, (payment) => payment)
  payments: Payment[];

  @Column()
  url: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({nullable: true})
  apiKey: string;
}
