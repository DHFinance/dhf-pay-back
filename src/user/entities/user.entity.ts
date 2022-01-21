import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty({
    description: 'Имя',
    default: 'kri',
  })
  name: string;

  @Column()
  @ApiProperty({
    description: 'Фамилия',
    default: 'ruban',
  })
  lastName: string;

  @Column()
  @ApiProperty({
    description: 'Зашифрованный пароль. Текущий пароль - admin',
    default: '5ZlEqFyVD4XMnxJsSFZf2Yra1k3m44o1E59v',
  })
  password: string;

  @Column({nullable: true})
  @ApiProperty({
    description: 'Код, высланный на email для сброса пароля. Нужен только на шаге /auth/check-code',
    default: null,
  })
  restorePasswordCode: number;

  @Column({nullable: true})
  @ApiProperty({
    description: 'Код, высланный на email для первичного подтверждения. Нужен только на шаге /auth/verify',
    default: null,
  })
  emailVerification: number;

  @Column()
  @ApiProperty({
    description: 'Почта пользователя',
    default: 'kriruban1@gmail.com',
  })
  email: string;

  @Column()
  @ApiProperty({
    description: 'Роль пользователя: admin или customer',
    default: 'customer',
  })
  role: 'admin' | 'customer';

  @Column()
  @ApiProperty({
    description: 'Компания',
    default: 'mail.ru',
  })
  company: string;

  @Column()
  @ApiProperty({
    description: 'Bearer токен пользователя',
    default: '5ZlEqFyVD4XMnxJsSFZf2Yra1k3m44o1E59v',
  })
  token: string;

  @Column()
  @ApiProperty({
    description: 'Состояние блокировки. Заблокированный пользователь не может авторизироваться',
    default: false,
  })
  blocked: boolean;
}
