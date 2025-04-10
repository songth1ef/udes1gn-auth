import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { OperationsService } from './operations.service';
import { Operation } from './operation.entity';

@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Post()
  async create(
    @Body() createOperationDto: { name: string; allowedRoleIds: string[] },
  ): Promise<Operation> {
    return this.operationsService.createOperation(
      createOperationDto.name,
      createOperationDto.allowedRoleIds,
    );
  }

  @Get()
  async findAll(): Promise<Operation[]> {
    return this.operationsService.getAllOperations();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Operation> {
    return this.operationsService.getOperationById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateOperationDto: { name: string; allowedRoleIds: string[] },
  ): Promise<Operation> {
    return this.operationsService.updateOperation(
      id,
      updateOperationDto.name,
      updateOperationDto.allowedRoleIds,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.operationsService.deleteOperation(id);
  }
}
