import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column()
  datetime: Date;

  @Column({type: 'bigint'})
  amount: string;

  @Column()
  comment: string;

  @Column()
  wallet: string;
}
