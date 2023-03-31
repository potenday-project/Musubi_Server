import { Entity, PrimaryGeneratedColumn, JoinColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Users } from './Users';
import { Friends } from './Friends';
import { EventType } from './common/Enums';
import { Presets } from './Presets';

@Entity({ name: 'Events' })
export class Events {
  @PrimaryGeneratedColumn('increment')
  Events_ID!: number;

  @ManyToOne(() => Users, (u) => u.Users_ID)
  @JoinColumn({ name: 'userId' })
  eventUserId!: Users | number;

  @ManyToOne(() => Friends, (f) => f.Friend_ID)
  @JoinColumn({ name: 'friendId' })
  friendId!: Friends | number;

  @ManyToOne(() => Presets, (f) => f.Preset_ID)
  @JoinColumn({ name: 'presetId' })
  presetId!: Presets | number;

  @Column({ type: 'varchar' })
  friendName!: string;

  @Column()
  eventType!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  memo!: string;

  @Column({ type: 'date' })
  eventTime!: Date;
}
