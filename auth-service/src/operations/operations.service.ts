import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operation } from './operation.entity';

@Injectable()
export class OperationsService {
  constructor(
    @InjectRepository(Operation)
    private operationsRepository: Repository<Operation>,
  ) {}

  async createOperation(
    name: string,
    allowedRoleIds: string[],
  ): Promise<Operation> {
    const operation = this.operationsRepository.create({
      name,
      allowedRoleIds,
    });
    return this.operationsRepository.save(operation);
  }

  async getAllOperations(): Promise<Operation[]> {
    return this.operationsRepository.find();
  }

  async getOperationById(id: number): Promise<Operation> {
    const operation = await this.operationsRepository.findOne({
      where: { id },
    });
    if (!operation) {
      throw new NotFoundException(`操作未找到: ${id}`);
    }
    return operation;
  }

  async updateOperation(
    id: number,
    name: string,
    allowedRoleIds: string[],
  ): Promise<Operation> {
    const operation = await this.getOperationById(id);
    operation.name = name;
    operation.allowedRoleIds = allowedRoleIds;
    return this.operationsRepository.save(operation);
  }

  async deleteOperation(id: number): Promise<void> {
    const operation = await this.getOperationById(id);
    await this.operationsRepository.remove(operation);
  }
}
