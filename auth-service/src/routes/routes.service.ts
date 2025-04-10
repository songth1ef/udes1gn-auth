import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from './route.entity';
import { Operation } from '../operations/operation.entity';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private routesRepository: Repository<Route>,
    @InjectRepository(Operation)
    private operationsRepository: Repository<Operation>,
  ) {}

  async createRoute(
    path: string,
    requiredRoles: string[],
    parentId?: number,
    redirect?: string,
    name?: string,
    icon?: string,
    title?: string,
    operations?: number[], // 新增参数，操作ID数组
  ): Promise<Route> {
    const route = this.routesRepository.create({
      path,
      requiredRoles,
      parentId,
      redirect,
      name,
      icon,
      title,
    });

    // 关联操作
    if (operations && operations.length > 0) {
      const ops = await this.operationsRepository.findByIds(operations);
      route.operations = ops;
    }

    return this.routesRepository.save(route);
  }

  async getAllRoutes(): Promise<any[]> {
    const routes = await this.routesRepository.find({
      relations: ['operations'],
    });
    return routes.map((route) => ({
      id: route.id,
      path: route.path,
      name: route.name,
      requiredRoles: route.requiredRoles,
      parentId: route.parentId,
      redirect: route.redirect,
      operations: route.operations, // 确保返回操作数组
      meta: {
        icon: route.icon,
        title: route.title,
      },
    }));
  }

  async getRoutesTree(): Promise<any[]> {
    const routes = await this.routesRepository.find();
    const map = {};
    const tree = [];

    routes.forEach((route) => {
      map[route.id] = { ...route, children: [] }; // 初始化每个路由的子节点
    });

    routes.forEach((route) => {
      if (route.parentId) {
        map[route.parentId].children.push(map[route.id]); // 将当前路由添加到其父路由的子节点中
      } else {
        tree.push(map[route.id]); // 如果没有父级，则为根节点
      }
    });

    return tree;
  }

  async getRoutesByRoleId(roleId: string): Promise<Route[]> {
    return this.routesRepository.find({
      where: { requiredRoles: roleId }, // 假设 requiredRoles 是以字符串形式存储角色ID
    });
  }

  async addRoleToRoute(routeId: number, roleId: number): Promise<Route> {
    const route = await this.routesRepository.findOne({
      where: { id: routeId },
    });
    if (!route) {
      throw new NotFoundException(`路由未找到: ${routeId}`);
    }
    route.addRole(roleId);
    return this.routesRepository.save(route);
  }

  async removeRoleFromRoute(routeId: number, roleId: number): Promise<Route> {
    const route = await this.routesRepository.findOne({
      where: { id: routeId },
    });
    if (!route) {
      throw new NotFoundException(`路由未找到: ${routeId}`);
    }
    route.requiredRoles = route.requiredRoles.filter(
      (id) => id !== roleId.toString(),
    );
    return this.routesRepository.save(route);
  }

  async addOperationToRoute(
    routeId: number,
    operationId: number,
  ): Promise<Route> {
    const route = await this.routesRepository.findOne({
      where: { id: routeId },
      relations: ['operations'],
    });
    if (!route) {
      throw new NotFoundException(`路由未找到: ${routeId}`);
    }

    const operation = await this.operationsRepository.findOne({
      where: { id: operationId },
    });
    if (!operation) {
      throw new NotFoundException(`操作未找到: ${operationId}`);
    }

    // 添加操作到路由
    if (!route.operations) {
      route.operations = [];
    }
    route.operations.push(operation);

    return this.routesRepository.save(route);
  }

  async removeOperationFromRoute(
    routeId: number,
    operationId: number,
  ): Promise<Route> {
    const route = await this.routesRepository.findOne({
      where: { id: routeId },
      relations: ['operations'],
    });
    if (!route) {
      throw new NotFoundException(`路由未找到: ${routeId}`);
    }

    // 从路由中移除操作
    route.operations = route.operations.filter((op) => op.id !== operationId);

    return this.routesRepository.save(route);
  }
}
