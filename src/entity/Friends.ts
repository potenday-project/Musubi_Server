import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { Users } from './Users';

export enum RankType {
  NONE,
  FIRST,
  SECOND,
  THIRD,
  FOURTH,
  FIFTH,
  SIXTH,
  SEVENTH,
}

@Entity({ name: 'Friends' })
export class Friends {
  @PrimaryGeneratedColumn('increment')
  Friend_ID!: number;

  @ManyToOne(() => Users, (u) => u.userId)
  @JoinColumn({ name: 'userId' })
  userId!: Users;

  @Column()
  name!: string;

  @Column({ type: 'enum', enum: RankType, default: RankType.NONE })
  rank!: RankType;

  @Column()
  relationship!: string;

  @Column({ type: 'date' })
  birth!: string;
}
