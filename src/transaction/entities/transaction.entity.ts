import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Payment } from "../../payment/entities/payment.entity";
import { JoinColumn } from "typeorm/browser";

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;

  @Column()
  email: string;

  @Column()
  updated: Date;

  @Column()
  txHash: string;

  @ManyToOne(() => Payment, payment => payment, {
    eager: true,
  })
  payment: Payment;

  @Column()
  sender: string;

  @Column({type: 'bigint'})
  amount: string;
}
