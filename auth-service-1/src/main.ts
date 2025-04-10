import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { GlobalAuthGuard } from './guards/global-auth.guard'; // 你需要创建这个文件

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 获取 JWT 服务和 Reflector 实例
  const jwtService = app.get(JwtService);
  const reflector = app.get(Reflector);

  // 设置全局认证守卫
  app.useGlobalGuards(new GlobalAuthGuard(jwtService, reflector));

  app.use(cookieParser());

  // 配置 Swagger
  const config = new DocumentBuilder()
    .setTitle('Auth Service API')
    .setDescription('The auth service API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 8001);
}
bootstrap();
