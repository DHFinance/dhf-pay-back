import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;

  @Column()
  updated: Date;

  @Column()
  txHash: string;

  @Column()
  sender: string;

  @Column({type: 'bigint'})
  amount: string;

  @Column()
  receiver: string;
}
