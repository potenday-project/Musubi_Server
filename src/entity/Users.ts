import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'Users' })
export class Users {
  // Users_ID : 해당 row를 구분하기 위한 Primary Key
  @PrimaryGeneratedColumn('increment')
  Users_ID!: number;

  // email : 이메일을 실제 로그인 아이디로 사용
  @Column()
  email!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  userId!: string;

  @Column()
  password!: string;

  @Column({ type: 'varchar', default: 'local' })
  provider!: string;

  // @Column()
  // snsId!: string;
}
