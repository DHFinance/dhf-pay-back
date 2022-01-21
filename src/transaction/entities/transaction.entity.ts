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
  @ApiProperty({
    description: 'Статус транзакции. processing при создании. success при выполнении. Информация об ошибке при сбое',
    default: 'processing',
  })
  status: string;

  @Column()
  @ApiProperty({
    description: 'Почта пользователя',
    default: 'kriruban1@gmail.com',
  })
  email: string;

  @Column()
  @ApiProperty({
    description: 'Время последнего обновления транзакции',
    default: '2022-01-20 12:46:26.000',
  })
  updated: Date;

  @Column()
  @ApiProperty({
    description: 'Уникальный хэш транзакции',
    default: '16ae42729a88a4df9519a8e08807d68856070d93cf162898948b7de57e1a3368',
  })
  txHash: string;

  @ManyToOne(() => Payment, payment => payment, {
    eager: true,
  })
  @ApiProperty({
    type: () => Payment,
    description: 'Payment, по реквизитам которого была произведена транзакция, можно указывать id или сам объект',
    default: 2,})
  payment: Payment;

  @Column()
  @ApiProperty({
    description: 'Кошелек отправителя',
    default: '01acdbbd933fd7aaedb7b1bd29c577027d86b5fafc422267a89fc386b7ebf420c9',
  })
  sender: string;

  @Column({type: 'bigint'})
  @ApiProperty({
    description: 'Количество переведенных токенов',
    default: '2500000000',
  })
  amount: string;
}
