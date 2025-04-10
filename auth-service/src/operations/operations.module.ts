import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperationsController } from './operations.controller';
import { OperationsService } from './operations.service';
import { Operation } from './operation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Operation])],
  controllers: [OperationsController],
  providers: [OperationsService],
  exports: [TypeOrmModule], // 确保导出 TypeOrmModule
})
export class OperationsModule {}
