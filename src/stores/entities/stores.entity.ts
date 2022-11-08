import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Payment } from '../../payment/entities/payment.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Stores extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user, { nullable: false })
  @ApiProperty({
    type: () => User,
    description:
      'The user who owns the store, you can specify the id or the object itself',
    default: 2,
  })
  user: User;

  @OneToMany(() => Payment, (payment) => payment)
  payments: Payment[];

  @Column({ nullable: false })
  @ApiProperty({
    description:
      'The address to which a post request with payment details will be sent when its status changes',
    default: 'https://lms.sfedu.ru/my/',
  })
  url: string;

  @Column({ nullable: false })
  @ApiProperty({
    description: 'Name of shop',
    default: 'Store',
  })
  name: string;

  @Column({ nullable: false })
  @ApiProperty({
    description:
      'Shop wallet. All payments created on behalf of this store will have this wallet',
    default:
      '01acdbbd933fd7aaedb7b1bd29c577027d86b5fafc422267a89fc386b7ebf420c9',
  })
  wallet: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Store Description',
    default: 'Good store',
  })
  description: string;

  @Column({ nullable: true })
  @ApiProperty({
    description:
      'Unique shop key. It is used to issue payment and transaction associated with this store',
    default: 'FL1f0BNoBB3qRQ4dKtzwNgmdT95qJniM89Ak',
  })
  apiKey: string;

  @Column({ default: false })
  @ApiProperty({
    description: 'Store lock status',
    default: false,
  })
  blocked: boolean;
}
