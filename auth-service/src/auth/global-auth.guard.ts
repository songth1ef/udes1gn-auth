import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Injectable()
export class GlobalAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      const res = context.switchToHttp().getResponse();
      console.log('未登录，重定向到登录页面');
      res.redirect('/login');
      return false;
    }

    try {
      const payload = this.jwtService.verify(token);
      request['user'] = payload;
      return true;
    } catch {
      const res = context.switchToHttp().getResponse();
      console.log('Token无效，重定向到登录页面');
      res.redirect('/login');
      return false;
    }
  }

  private extractToken(request: any): string | undefined {
    if (request.cookies && request.cookies.access_token) {
      return request.cookies.access_token;
    }
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
