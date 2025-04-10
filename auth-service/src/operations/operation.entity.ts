import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Route } from '../routes/route.entity';

@Entity()
export class Operation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string; // 操作名称

  @Column('simple-array', { nullable: true })
  allowedRoleIds: string[]; // 允许执行该操作的角色ID列表

  @ManyToOne(() => Route, (route) => route.operations, { nullable: true })
  route: Route; // 关联的路由
}
