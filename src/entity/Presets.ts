import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Users } from './Users';

@Entity({ name: 'Presets' })
export class Presets {
  @PrimaryGeneratedColumn('increment')
  Preset_ID!: number;

  @ManyToOne(() => Users, (user) => user.User_ID)
  @JoinColumn({name: "user_id"})
  user_id!: Users;

  @Column()
  type!: string;

  @Column()
  first!: number;

  @Column()
  second!: number;

  @Column({ nullable: true })
  third!: number;

  @Column({ nullable: true })
  fourth!: number;

  @Column({ nullable: true })
  fifth!: number;

  @Column({ nullable: true })
  sixth!: number;

  @Column({ nullable: true })
  seventh!: number;
}
