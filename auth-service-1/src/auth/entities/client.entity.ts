import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  clientId: string;

  @Column()
  clientSecret: string;

  @Column()
  name: string;

  @Column('simple-array')
  redirectUris: string[];

  @Column({ default: true })
  isActive: boolean;
}
