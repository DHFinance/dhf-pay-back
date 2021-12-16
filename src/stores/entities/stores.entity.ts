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

  @ManyToOne(() => User, user => user, {nullable: false})
  user: User;

  @OneToMany(() => Payment, (payment) => payment)
  payments: Payment[];

  @Column({nullable: false})
  url: string;

  @Column({nullable: false})
  name: string;

  @Column({nullable: true})
  description: string;

  @Column({nullable: true})
  apiKey: string;

  @Column({default: false})
  blocked: boolean;
}
