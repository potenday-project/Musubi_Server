import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { RankType } from './common/Enums';
import { Users } from './Users';

@Entity({ name: 'Friends' })
export class Friends {
  @PrimaryGeneratedColumn('increment')
  Friend_ID!: number;

  @ManyToOne(() => Users, (u) => u.Users_ID)
  @JoinColumn({ name: 'userId' })
  friendUserId!: Users;

  @Column({unique: true})
  name!: string;

  @Column({ type: "enum", enum: RankType, default: RankType.FOURTH })
  rank!: RankType;

  // @Column({ type: 'date' })
  // birth!: string;
}
