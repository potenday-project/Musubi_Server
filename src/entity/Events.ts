import { Entity, PrimaryGeneratedColumn, JoinColumn, Column, ManyToOne } from 'typeorm';
import { Users } from './Users';
import { Friends } from './Friends';
import { Presets } from './Presets';

@Entity({ name: 'Events' })
export class Events {
  @PrimaryGeneratedColumn('increment')
  Friend_ID!: number;

  @ManyToOne(() => Users, (u) => u.User_ID)
  @JoinColumn({ name: 'user_id' })
  user_id!: Users;

  @ManyToOne(() => Friends, (f) => f.name)
  @JoinColumn({ name: 'friend_name' })
  friend_name!: Friends;

  @ManyToOne(() => Presets, (p) => p.type)
  @JoinColumn({ name: 'type' })
  type!: Presets;

  @Column()
  title!: string;

  @Column({ type: 'date' })
  eventTime!: string;
}
