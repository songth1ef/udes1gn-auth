import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { Route } from './route.entity';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post()
  async create(
    @Body()
    createRouteDto: {
      path: string;
      requiredRoles: string[];
      parentId?: number;
      redirect?: string;
      name?: string;
      icon?: string;
      title?: string;
      operations?: number[]; // 新增参数，操作ID数组
    },
  ): Promise<Route> {
    return this.routesService.createRoute(
      createRouteDto.path,
      createRouteDto.requiredRoles,
      createRouteDto.parentId,
      createRouteDto.redirect,
      createRouteDto.name,
      createRouteDto.icon,
      createRouteDto.title,
      createRouteDto.operations,
    );
  }

  @Get()
  async findAll(): Promise<Route[]> {
    return this.routesService.getAllRoutes();
  }

  @Get('tree')
  async findTree(): Promise<any[]> {
    return this.routesService.getRoutesTree();
  }

  @Get('roles/:roleId')
  async findRoutesByRoleId(@Param('roleId') roleId: string): Promise<Route[]> {
    return this.routesService.getRoutesByRoleId(roleId);
  }

  @Post('roles/:id')
  async addRole(
    @Param('id') id: number,
    @Body('roleId') roleId: number,
  ): Promise<Route> {
    return this.routesService.addRoleToRoute(id, roleId);
  }

  @Post('roles/remove/:id')
  async removeRole(
    @Param('id') id: number,
    @Body('roleId') roleId: number,
  ): Promise<Route> {
    return this.routesService.removeRoleFromRoute(id, roleId);
  }

  @Post('addOperations')
  async addOperations(@Body() body: { routeId: number; operationId: number }) {
    return this.routesService.addOperationToRoute(
      body.routeId,
      body.operationId,
    );
  }

  @Post('deleteOperations')
  async deleteOperations(
    @Body() body: { routeId: number; operationId: number },
  ) {
    return this.routesService.removeOperationFromRoute(
      body.routeId,
      body.operationId,
    );
  }
}
