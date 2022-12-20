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
import { WalletOrmEntity } from '../../wallets/orm-entities/wallet.entity';

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

  @OneToMany(() => WalletOrmEntity, (wallet) => wallet.store)
  wallets: WalletOrmEntity[];
}
