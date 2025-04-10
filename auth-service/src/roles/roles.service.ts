import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './roles.entity';
import { Route } from '../routes/route.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Route)
    private routesRepository: Repository<Route>,
  ) {}

  async createRole(name: string): Promise<Role> {
    const role = this.rolesRepository.create({ name });
    return this.rolesRepository.save(role);
  }

  async getAllRoles(): Promise<Role[]> {
    return this.rolesRepository.find();
  }
  async findOne(id: number): Promise<any> {
    const role = await this.rolesRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`角色未找到: ${id}`);
    }

    // 获取与该角色相关的路由
    // const routes: any = await this.routesRepository.find({
    //   where: { requiredRoles: id.toString() }, // 假设 requiredRoles 存储角色ID
    // });

    const routes: Route[] = await this.routesRepository.find(); // 返回所有路由

    return {
      ...role,
      routes,
    };
  }
}
