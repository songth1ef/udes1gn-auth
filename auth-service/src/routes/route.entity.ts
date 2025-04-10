import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Operation } from '../operations/operation.entity';

@Entity()
export class Route {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  path: string;

  @Column({ nullable: true })
  parentId: number; // 用于树形结构的父级路由

  @Column('simple-array', { nullable: true })
  requiredRoles: string[]; // 这里假设是字符串数组，存储角色ID

  @Column({ nullable: true })
  name: string; // 路由名称

  @Column({ nullable: true })
  redirect: string; // 重定向字段

  @Column({ nullable: true })
  icon: string; // 图标字段

  @Column({ nullable: true })
  title: string; // 标题字段

  @OneToMany(() => Operation, (operation) => operation.route)
  operations: Operation[]; // 关联的操作数组

  // 添加 addRole 方法
  addRole(roleId: number): void {
    const roleIdStr = roleId.toString(); // 将角色ID转换为字符串

    if (!this.requiredRoles) {
      this.requiredRoles = [];
    }

    // 确保 requiredRoles 中的所有元素都是字符串
    this.requiredRoles = this.requiredRoles.map(String);

    if (!this.requiredRoles.includes(roleIdStr)) {
      this.requiredRoles.push(roleIdStr);
    }
  }
}
