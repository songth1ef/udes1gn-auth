import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from '../roles/roles.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { username },
      relations: ['roles'],
    });
  }
  async findOneById(userId: number): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { userId },
      relations: ['roles'],
    });
  }

  async createUser(username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['roles'] });
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async updateUserRoles(userId: number, roleIds: number[]): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { userId },
      relations: ['roles'],
    });
    if (!user) {
      throw new NotFoundException('用户未找到');
    }

    const roles = await this.rolesRepository.findByIds(roleIds);
    user.roles = roles;
    return this.usersRepository.save(user);
  }
}
