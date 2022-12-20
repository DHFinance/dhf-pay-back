import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

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

  @Column({ select: false })
  @ApiProperty({
    description: 'Encrypted password. Current value - admin',
    default: '$2b$07$n2L5W1iaZwRHyQO2YK72NOibkpofUQBBMCGHboosUWD0VI4NUyW1C',
  })
  password: string;

  @Column({ nullable: true })
  @ApiProperty({
    description:
      'The code sent to your email to reset your password. Only needed at the /auth/check-code step',
    default: null,
  })
  restorePasswordCode: number;

  @Column({ nullable: true })
  @ApiProperty({
    description:
      'Code sent to email for initial confirmation. Only needed at the /auth/verify step',
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
  role: string; //'admin' | 'customer';

  @Column()
  @ApiProperty({
    description: 'Company',
    default: 'mail.ru',
  })
  company: string;

  @Column()
  @ApiProperty({
    description: 'Bearer user token',
    default: 'vNRszdkcktWZhQlZt0qjhAE4334oIq07s4OM',
  })
  token: string;

  @Column()
  @ApiProperty({
    description: 'Lock state. Blocked user cannot login',
    default: false,
  })
  blocked: boolean;

  @Column({ nullable: true })
  @ApiProperty({
    default: 0,
  })
  loginAttempts: number;

  @CreateDateColumn({ nullable: true })
  @ApiProperty({
    default: null,
  })
  timeBlockLogin: Date;
}
