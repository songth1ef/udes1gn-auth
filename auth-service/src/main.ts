import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import helmet from 'helmet';

// 根据环境选择合适的.env文件
const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.development';

// 检查环境文件是否存在
const envPath = path.resolve(process.cwd(), envFile);
if (fs.existsSync(envPath)) {
  console.log(`正在加载环境配置: ${envFile}`);
  dotenv.config({ path: envPath });
} else {
  console.warn(`找不到环境文件${envFile}，使用.env`);
  dotenv.config();
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { GlobalAuthGuard } from './auth/global-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import rateLimit from 'express-rate-limit';
import { LogLevel } from '@nestjs/common';

async function bootstrap() {
  // 创建应用实例
  const logLevels = ['error', 'warn'] as LogLevel[];
  if (process.env.LOG_LEVEL) {
    // 确保LOG_LEVEL是有效的LogLevel类型
    const level = process.env.LOG_LEVEL as LogLevel;
    logLevels.push(level);
  }

  const app = await NestFactory.create(AppModule, {
    logger: logLevels,
  });

  // 在开发环境中，完全不使用安全头部
  if (process.env.NODE_ENV === 'production') {
    console.log('生产环境：使用标准安全头部');
    app.use(
      helmet({
        contentSecurityPolicy: true,
        xssFilter: true,
        hsts: {
          maxAge: 31536000,
          includeSubDomains: true,
        },
        frameguard: {
          action: 'deny',
        },
      }),
    );
  } else {
    console.log('开发环境：完全禁用所有安全头部');
    // 开发环境不添加任何安全头部
  }

  // 添加全局速率限制
  app.use(
    rateLimit({
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
      max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        statusCode: 429,
        message: '请求过于频繁，请稍后再试',
        error: 'Too Many Requests',
      },
    }),
  );

  // 登录特定的更严格限制
  app.use(
    '/auth/login',
    rateLimit({
      windowMs: parseInt(
        process.env.LOGIN_RATE_LIMIT_WINDOW_MS || '3600000',
        10,
      ),
      max: parseInt(process.env.LOGIN_RATE_LIMIT_MAX || '10', 10),
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        statusCode: 429,
        message: '登录尝试过多，请稍后再试',
        error: 'Too Many Requests',
      },
    }),
  );

  // Cookie解析
  app.use(cookieParser());

  // 全局认证守卫
  const jwtService = app.get(JwtService);
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new GlobalAuthGuard(jwtService, reflector));

  // 配置CORS
  const corsOrigin =
    process.env.CORS_ORIGIN === '*'
      ? true
      : process.env.CORS_ORIGIN?.split(',');

  app.enableCors({
    origin: corsOrigin || true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Swagger API文档配置
  if (process.env.NODE_ENV !== 'production') {
    const options = new DocumentBuilder()
      .setTitle('认证服务 API')
      .setDescription('认证服务接口文档')
      .setVersion('1.0')
      .addTag('auth')
      .addBearerAuth() // 添加Bearer认证
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  }

  // 会话配置
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'fallback_secret_key', // 从环境变量获取密钥
      resave: false,
      saveUninitialized: false,
      rolling: true, // 每次请求都重置过期时间
      cookie: {
        secure: false, // 开发环境强制禁用secure，不使用HTTPS
        httpOnly: true, // 仅允许服务器访问cookie
        sameSite: 'lax', // 防止CSRF
        maxAge: 30 * 60 * 1000, // 30分钟过期
      },
    }),
  );

  // 启动服务器
  const port = process.env.PORT || 3000;
  const server = await app.listen(port);
  const serverUrl = await app.getUrl();

  console.log(`应用程序环境: ${process.env.NODE_ENV || 'development'}`);
  console.log(`应用程序正在运行: ${serverUrl}`);

  return server;
}

bootstrap()
  .then(() => console.log('应用程序启动成功'))
  .catch((err) => console.error('应用程序启动失败:', err));
