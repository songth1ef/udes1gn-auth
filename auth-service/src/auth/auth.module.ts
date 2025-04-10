import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './local.strategy'; // 引入策略
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './client.entity';
import * as fs from 'fs';
import * as path from 'path';
import { CaptchaService } from './captcha.service'; // 导入验证码服务
import { CaptchaController } from './captcha.controller'; // 导入验证码控制器

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      ...(process.env.Symmetric_Encryption === 'true'
        ? {
            secret: process.env.JWT_SECRET_KEY,
            signOptions: { expiresIn: '60m' },
          }
        : {
            publicKey: fs.readFileSync(
              path.join(__dirname, '..', '..', 'src', 'auth', 'public_key.pem'),
              'utf8',
            ),
            privateKey: fs.readFileSync(
              path.join(
                __dirname,
                '..',
                '..',
                'src',
                'auth',
                'private_key.pem',
              ),
              'utf8',
            ),
            signOptions: { algorithm: 'RS256', expiresIn: '60m' },
          }),
    }),
    TypeOrmModule.forFeature([Client]),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, CaptchaService], // 添加验证码服务
  controllers: [AuthController, CaptchaController], // 添加验证码控制器
  exports: [AuthService, JwtModule], // 添加 JwtModule 到 exports 中
})
export class AuthModule {}
