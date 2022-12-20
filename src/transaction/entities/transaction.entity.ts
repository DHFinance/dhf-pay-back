import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Payment } from '../../payment/entities/payment.entity';

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty({
    description:
      'Transaction status. processing when created. success on execution. Error information on crash',
    default: 'processing',
  })
  status: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'User mail',
    default: 'kriruban1@gmail.com',
  })
  email: string;

  @Column()
  @ApiProperty({
    description: 'Transaction last update time',
    default: '2022-01-20 12:46:26.000',
  })
  updated: Date;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Unique transaction hash',
    default: '16ae42729a88a4df9519a8e08807d68856070d93cf162898948b7de57e1a3368',
  })
  txHash: string;

  @ManyToOne(() => Payment, (payment) => payment, {
    eager: true,
  })
  @ApiProperty({
    type: () => Payment,
    description:
      'Payment, according to the details of which the transaction was made, you can specify the id or the object itself',
    default: 2,
  })
  payment: Payment;

  @Column({ nullable: true })
  @ApiProperty({
    description: "Sender's wallet",
    default:
      '01acdbbd933fd7aaedb7b1bd29c577027d86b5fafc422267a89fc386b7ebf420c9',
  })
  sender: string;

  @Column({ type: 'bigint' })
  @ApiProperty({
    description: 'Number of transferred tokens',
    default: '2500000000',
  })
  amount: string;

  @Column({ nullable: true })
  walletForTransaction: string;
}
