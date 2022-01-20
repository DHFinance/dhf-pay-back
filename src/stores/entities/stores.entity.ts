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
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Stores extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user, {nullable: false})
  @ApiProperty({type: () => User})
  user: User;

  @OneToMany(() => Payment, (payment) => payment)
  @ApiProperty({type: () => Payment})
  payments: Payment[];

  @Column({nullable: false})
  @ApiProperty()
  url: string;

  @Column({nullable: false})
  @ApiProperty()
  name: string;

  @Column({nullable: false})
  @ApiProperty()
  wallet: string;

  @Column({nullable: true})
  @ApiProperty()
  description: string;

  @Column({nullable: true})
  @ApiProperty()
  apiKey: string;

  @Column({default: false})
  @ApiProperty()
  blocked: boolean;
}
