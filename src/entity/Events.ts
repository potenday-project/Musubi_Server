import { Entity, PrimaryGeneratedColumn, JoinColumn, Column, ManyToOne } from 'typeorm';
import { Users } from './Users';
import { Friends } from './Friends';
import { Presets } from './Presets';


@Entity({ name: 'Events' })
export class Events {
  @PrimaryGeneratedColumn('increment')
  Events_ID!: number;

  @ManyToOne(() => Users, (u) => u.Users_ID)
  @JoinColumn({ name: 'userId' })
  eventUserId!: Users;

  @ManyToOne(() => Friends, (f) => f.Friend_ID)
  @JoinColumn({ name: 'friendId' })
  friendId!: Friends;

  @ManyToOne(() => Presets, (p) => p.Preset_ID)
  @JoinColumn({ name: 'presetId'})
  presetId!: Presets;

  @Column()
  type!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({ type: 'date' })
  eventTime!: string;
}
