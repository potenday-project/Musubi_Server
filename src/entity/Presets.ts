import { Entity, PrimaryGeneratedColumn, Column, JoinColumn,OneToOne, ManyToOne, OneToMany } from 'typeorm';
import { EventType } from './common/Enums';
import { Users } from './Users';

@Entity({ name: 'Presets' })
export class Presets {
  @PrimaryGeneratedColumn('increment')
  Preset_ID!: number;

  @ManyToOne(() => Users, (u) => u.Users_ID)
  @JoinColumn({name: 'presetUserId'})
  presetUserId!: Users;

  @Column({unique: true})
  type!: string;

  @Column()
  first!: number;

  @Column()
  second!: number;

  @Column({ nullable: true, default: 0})
  third!: number;

  @Column({ nullable: true, default: 0})
  fourth!: number;

  // @Column({ nullable: true, default: 0})
  // fifth!: number;

  // @Column({ nullable: true, default: 0})
  // sixth!: number;

  // @Column({ nullable: true, default: 0})
  // seventh!: number;
}

// 추후에 number -> enum으로 변경해야함
