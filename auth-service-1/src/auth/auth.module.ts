import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import * as fs from 'fs';
import * as path from 'path';
// import { CaptchaService } from './captcha.service';
// import { CaptchaController } from './captcha.controller';

@Module({
  imports: [
    // UsersModule,
    PassportModule,
    JwtModule.register({
      ...(process.env.Symmetric_Encryption === 'true'
        ? {
            secret: process.env.JWT_SECRET_KEY,
            signOptions: { expiresIn: '60m' },
          }
        : {
            publicKey: fs.readFileSync(
              path.join(
                __dirname,
                '..',
                '..',
                'src',
                'auth',
                'tools',
                'public_key.pem',
              ),
              'utf8',
            ),
            privateKey: fs.readFileSync(
              path.join(
                __dirname,
                '..',
                '..',
                'src',
                'auth',
                'tools',
                'private_key.pem',
              ),
              'utf8',
            ),
            signOptions: { algorithm: 'RS256', expiresIn: '60m' },
          }),
    }),
    TypeOrmModule.forFeature([Client]),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, CaptchaService],
  controllers: [AuthController, CaptchaController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
