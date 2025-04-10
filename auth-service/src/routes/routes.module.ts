import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { Route } from './route.entity';
import { OperationsModule } from '../operations/operations.module'; // 导入 OperationsModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Route]),
    OperationsModule, // 确保导入 OperationsModule
  ],
  providers: [RoutesService],
  controllers: [RoutesController],
})
export class RoutesModule {}
