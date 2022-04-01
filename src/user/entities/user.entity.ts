import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty({
    description: 'Name',
    default: 'kri',
  })
  name: string;

  @Column()
  @ApiProperty({
    description: 'Last name',
    default: 'ruban',
  })
  lastName: string;

  @Column({select: false})
  @ApiProperty({
    description: 'Encrypted password. Current value - admin',
    default: '$2b$07$PUx7RK/NjXwo7i9xpYT2vejPjU3A4hxCCvYYkDbZ/fcfgyFnCw9f.',
  })
  password: string;

  @Column({nullable: true})
  @ApiProperty({
    description: 'The code sent to your email to reset your password. Only needed at the /auth/check-code step',
    default: null,
  })
  restorePasswordCode: number;

  @Column({nullable: true})
  @ApiProperty({
    description: 'Code sent to email for initial confirmation. Only needed at the /auth/verify step',
    default: null,
  })
  emailVerification: number;

  @Column()
  @ApiProperty({
    description: 'User mail',
    default: 'kriruban1@gmail.com',
  })
  email: string;

  @Column()
  @ApiProperty({
    description: 'User role: admin or customer',
    default: 'customer',
  })
  role: string //'admin' | 'customer';

  @Column()
  @ApiProperty({
    description: 'Company',
    default: 'mail.ru',
  })
  company: string;

  @Column()
  @ApiProperty({
    description: 'Bearer user token',
    default: '5ZlEqFyVD4XMnxJsSFZf2Yra1k3m44o1E59v',
  })
  token: string;

  @Column()
  @ApiProperty({
    description: 'Lock state. Blocked user cannot login',
    default: false,
  })
  blocked: boolean;
}
