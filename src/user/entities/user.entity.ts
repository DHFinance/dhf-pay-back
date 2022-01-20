import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  lastName: string;

  @Column()
  @ApiProperty()
  password: string;

  @Column({nullable: true})
  @ApiProperty()
  restorePasswordCode: number;

  @Column({nullable: true})
  @ApiProperty()
  emailVerification: number;

  @Column()
  @ApiProperty()
  email: string;

  @Column()
  @ApiProperty()
  role: 'admin' | 'customer';

  @Column()
  @ApiProperty()
  company: string;

  @Column()
  @ApiProperty()
  token: string;

  @Column()
  @ApiProperty()
  blocked: boolean;
}
