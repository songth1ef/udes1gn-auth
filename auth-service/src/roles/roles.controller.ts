import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './roles.entity';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(@Body() createRoleDto: { name: string }): Promise<Role> {
    return this.rolesService.createRole(createRoleDto.name);
  }

  @Get()
  async findAll(): Promise<Role[]> {
    return this.rolesService.getAllRoles();
  }

  @Get('route/:id')
  async findOne(@Param('id') id: number): Promise<any> {
    return this.rolesService.findOne(id); // 返回角色及其相关路由信息
  }
}
