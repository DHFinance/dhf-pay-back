import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column({nullable: true})
  restorePasswordCode: number;

  @Column()
  email: string;

  @Column()
  role: 'admin' | 'customer';

  @Column()
  company: string;

  @Column()
  token: string;

  @Column()
  blocked: boolean;
}
