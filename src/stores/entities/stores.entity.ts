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
  @ApiProperty({type: () => User,
    description: 'Пользователь, которому принадлежит магазин, можно указывать id или сам объект',
    default: 2,
  })
  user: User;

  @OneToMany(() => Payment, (payment) => payment)
  payments: Payment[];

  @Column({nullable: false})
  @ApiProperty({
    description: 'Адрес, на который придет post запрос с деталями платежа при изменении его статуса',
    default: 'https://lms.sfedu.ru/my/',
  })
  url: string;

  @Column({nullable: false})
  @ApiProperty({
    description: 'Название магазина',
    default: 'Store',
  })
  name: string;

  @Column({nullable: false})
  @ApiProperty({
    description: 'Кошелек магазина. Все payment, созданные от лица этого магазина будут иметь этот кошелек',
    default: '01acdbbd933fd7aaedb7b1bd29c577027d86b5fafc422267a89fc386b7ebf420c9',
  })
  wallet: string;

  @Column({nullable: true})
  @ApiProperty({
    description: 'Описание магазина',
    default: 'Good store',
  })
  description: string;

  @Column({nullable: true})
  @ApiProperty({
    description: 'Уникальный ключ магазина. По нему осуществляется выдача payment и transaction, связанных с этим магазином',
    default: 'FL1f0BNoBB3qRQ4dKtzwNgmdT95qJniM89Ak',
  })
  apiKey: string;

  @Column({default: false})
  @ApiProperty({
    description: 'Статус блокировки магазина',
    default: false,
  })
  blocked: boolean;
}
