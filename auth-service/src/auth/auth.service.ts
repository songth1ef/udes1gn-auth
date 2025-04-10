import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';
import { Role } from 'src/roles/roles.entity';

@Injectable()
export class AuthService {
  private authorizationCodes: Map<string, { code: string; userId: number }> =
    new Map();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  private createPayload(user: {
    userId: number;
    username: string;
    roles: Role[];
  }) {
    return {
      sub: user.userId,
      username: user.username,
      roles: user.roles.map((role) => role.name), // 提取角色名称
    };
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (
      user &&
      (await this.usersService.validatePassword(
        password.toLowerCase(),
        user.password,
      ))
    ) {
      const { password, ...result } = user; // 去掉密码字段
      return result;
    }
    return null; // 如果用户未找到或密码不正确
  }

  async login(user: any) {
    const payload = this.createPayload(user);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async handleOidcUser(oidcUser: any) {
    let user = await this.usersService.findOne(oidcUser.email);
    if (!user) {
      user = await this.usersService.createUser(oidcUser.email, 'oidc-user');
    }
    return this.login(user);
  }

  generateAuthorizationCode(userId: number): string {
    const code = crypto.randomBytes(32).toString('hex');
    this.authorizationCodes.set(code, { code, userId });
    return code;
  }

  validateAuthorizationCode(code: string): { userId: number } | null {
    const entry = this.authorizationCodes.get(code);
    if (entry) {
      return { userId: entry.userId };
    }
    return null;
  }

  deleteAuthorizationCode(code: string): void {
    setTimeout(() => {
      this.authorizationCodes.delete(code);
    }, 6 * 1000);
  }

  generateAccessToken(user: {
    userId: number;
    username: string;
    roles: Role[];
  }): string {
    const payload = this.createPayload(user);
    return this.jwtService.sign(payload);
  }

  async validateClient(
    clientId: string,
    redirectUri: string,
  ): Promise<boolean> {
    const client = await this.clientRepository.findOne({
      where: { clientId, isActive: true },
    });
    return client && client.redirectUris.includes(redirectUri);
  }

  async registerClient(name: string, redirectUris: string[]): Promise<Client> {
    const clientId = crypto.randomBytes(16).toString('hex');
    const clientSecret = crypto.randomBytes(32).toString('hex');

    const client = new Client();
    client.clientId = clientId;
    client.clientSecret = clientSecret;
    client.name = name;
    client.redirectUris = redirectUris;

    return await this.clientRepository.save(client);
  }

  async getAllClients(): Promise<Client[]> {
    return this.clientRepository.find();
  }

  async validateClientCredentials(
    clientId: string,
    clientSecret: string,
    redirectUri: string,
  ): Promise<boolean> {
    const client = await this.clientRepository.findOne({ where: { clientId } });
    if (!client) {
      return false;
    }

    return (
      client.clientSecret === clientSecret &&
      client.redirectUris.includes(redirectUri)
    );
  }

  async validateClientId(clientId: string): Promise<boolean> {
    const client = await this.clientRepository.findOne({ where: { clientId } });
    return !!client;
  }
}
