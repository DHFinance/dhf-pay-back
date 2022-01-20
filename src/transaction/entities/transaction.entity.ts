import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Payment } from "../../payment/entities/payment.entity";
import { JoinColumn } from "typeorm/browser";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty()
  status: string;

  @Column()
  @ApiProperty()
  email: string;

  @Column()
  @ApiProperty()
  updated: Date;

  @Column()
  @ApiProperty()
  txHash: string;

  @ManyToOne(() => Payment, payment => payment, {
    eager: true,
  })
  @ApiProperty({type: () => Payment})
  payment: Payment;

  @Column()
  @ApiProperty()
  sender: string;

  @Column({type: 'bigint'})
  @ApiProperty()
  amount: string;
}
