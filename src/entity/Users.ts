import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Presets } from './Presets';
import { Friends } from './Friends';
import { Events } from './Events';

@Entity({ name: 'Users' })
export class Users {
  @PrimaryGeneratedColumn('uuid')
  User_ID!: string;

  @Column()
  email!: string;

  @Column()
  name!: string;

  @Column()
  password!: string;

  @Column({type: "varchar", default: "local"})
  provider!: string;

  @Column()
  snsId!: string;
}
