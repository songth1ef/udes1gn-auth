import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from '../roles/roles.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true, default: 'zh-CN' })
  lang: string;

  // @Column('simple-array')
  // roles: string[];

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles: Role[];
}
