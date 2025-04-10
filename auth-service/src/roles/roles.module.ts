import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './roles.entity';
import { Route } from '../routes/route.entity'; // 导入 Route 实体

@Module({
  imports: [TypeOrmModule.forFeature([Role, Route])], // 确保导入 Route
  providers: [RolesService],
  controllers: [RolesController],
  exports: [TypeOrmModule], // 确保导出 TypeOrmModule
})
export class RolesModule {}
