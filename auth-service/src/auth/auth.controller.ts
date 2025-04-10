import {
  Controller,
  Post,
  Get,
  Request,
  UseGuards,
  Body,
  Res,
  Query,
  UnauthorizedException,
  Param,
  Put,
} from '@nestjs/common';
import { Public } from './public.decorator';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { UsersService } from '../users/users.service';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res() res: Response) {
    const {
      client_id,
      redirect_uri,
      response_type,
      state,
      captcha,
      captchaId,
      lang,
    } = req.body;

    // 校验验证码
    if (
      !req.session.captchaCodes ||
      req.session.captchaCodes[captchaId]?.toLowerCase() !== captcha?.toLowerCase()
    ) {
      // 从会话中获取与临时标识符关联的验证码
      return res.status(400).json({ error: 'invalid_captcha' }); // 验证失败
    }

    const result = await this.authService.login(req.user);

    // 检查是否是OAuth流程
    if (client_id && redirect_uri && response_type === 'code') {
      // 只验证客户端ID
      if (!(await this.authService.validateClientId(client_id))) {
        return res.status(400).json({ error: 'invalid_client' });
      }

      // 生成授权码
      const code = this.authService.generateAuthorizationCode(req.user.userId);

      // 构建重定向URL
      const redirectUrl = new URL(redirect_uri);
      redirectUrl.searchParams.append('code', code);
      if (state) {
        redirectUrl.searchParams.append('state', state);
      }

      // 直接重定向到构建的URL，确保使用HTTP协议
      let finalUrl = redirectUrl.toString();
      finalUrl = finalUrl.replace('https:', 'http:');
      console.log('OAuth重定向到:', finalUrl);
      
      if (lang) {
        finalUrl += '&lang=' + lang;
      }
      
      return res.redirect(302, finalUrl);
    }

    // 如果不是OAuth流程，设置cookie并重定向到根目录
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: false, // 强制不使用HTTPS
      maxAge: 60 * 60 * 1000, // 1小时
    });

    // 确保直接使用HTTP协议
    const host = req.get('host');
    const redirectUrl = `http://${host}/`;
    console.log(`重定向到: ${redirectUrl}`);
    
    // 使用绝对URL，强制指定HTTP协议
    return res.redirect(302, redirectUrl);
  }

  @Public()
  @Post('register')
  async register(
    @Body()
    createUserDto: {
      username: string;
      password: string;
    },
  ) {
    await this.usersService.createUser(
      createUserDto.username,
      createUserDto.password,
    );
    return 'success';
  }

  @Get('authorize')
  async authorize(
    @Query('client_id') clientId: string,
    @Query('redirect_uri') redirectUri: string,
    @Query('response_type') responseType: string,
    @Query('scope') scope: string,
    @Query('state') state: string,
    @Request() req,
    @Res() res: Response,
  ) {
    // 验证客户端ID和重定向URI（这里需要实现客户端管理）
    if (!this.authService.validateClient(clientId, redirectUri)) {
      return res.status(400).json({ error: 'invalid_request' });
    }

    if (responseType !== 'code') {
      return res.status(400).json({ error: 'unsupported_response_type' });
    }

    // 检查用户是否已认证（这里假设使用session）
    if (!req.session.userId) {
      const loginUrl = `/login?redirect=${encodeURIComponent(req.url)}`;
      console.log('未登录，重定向到:', loginUrl);
      return res.redirect(302, loginUrl);
    }

    // 生成授权码
    const code = this.authService.generateAuthorizationCode(req.session.userId);

    // 重定向回客户端
    const redirectUrl = new URL(redirectUri);
    redirectUrl.searchParams.append('code', code);
    if (state) {
      redirectUrl.searchParams.append('state', state);
    }
    let finalUrl = redirectUrl.toString();
    finalUrl = finalUrl.replace('https:', 'http:');
    console.log('授权码重定向到:', finalUrl);
    return res.redirect(302, finalUrl);
  }

  @Public()
  @Post('token')
  async token(
    @Body('grant_type') grantType: string,
    @Body('code') code: string,
    @Body('redirect_uri') redirectUri: string,
    @Body('client_id') clientId: string,
    @Body('client_secret') clientSecret: string,
    @Res() res: Response,
  ) {
    // 验证客户端凭据
    if (
      !(await this.authService.validateClientCredentials(
        clientId,
        clientSecret,
        redirectUri,
      ))
    ) {
      return res.status(401).json({ error: 'invalid_client' });
    }

    if (grantType !== 'authorization_code') {
      return res.status(400).json({ error: 'unsupported_grant_type' });
    }

    // 验证授权码
    try {
      const authInfo = await this.authService.validateAuthorizationCode(code);

      if (!authInfo) {
        return res.status(400).json({ error: 'invalid_grant' });
      }
      const userInfo = await this.usersService.findOneById(authInfo.userId);
      // 生成访问令牌
      const accessToken = await this.authService.generateAccessToken(userInfo);

      // 成功生成访问令牌后，删除授权码
      this.authService.deleteAuthorizationCode(code);

      // 返回令牌响应
      return res.json({
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: 3600, // 令牌有效期，单位为秒
      });
    } catch (_) {
      return res.status(500).json({ error: 'internal_server_error' });
    }
  }

  @Post('refresh-token')
  async refreshToken(
    @Body('refresh_token') refreshToken: string,
    @Res() res: Response,
  ) {
    // 验证 refresh token
    const authInfo =
      await this.authService.validateAuthorizationCode(refreshToken);

    if (!authInfo) {
      return res.status(400).json({ error: 'invalid_grant' });
    }

    const userInfo = await this.usersService.findOneById(authInfo.userId);

    if (!userInfo) {
      return res.status(404).json({ error: 'user_not_found' });
    }

    // 生成新的 access token
    const newAccessToken = await this.authService.generateAccessToken(userInfo);

    // 返回新的 access token
    return res.json({
      access_token: newAccessToken,
      token_type: 'Bearer',
      expires_in: 3600, // 令牌有效期，单位为秒
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('userinfo')
  async userinfo(@Request() req, @Res() res: Response) {
    if (!req.user || !req.user.username) {
      throw new UnauthorizedException('Invalid user information');
    }

    const user = await this.usersService.findOne(req.user.username);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // 返回用户信息
    return res.json({
      sub: user.userId,
      username: user.username,
      email: user.email,
      roles: user.roles,
    });
  }

  @Get('users')
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Post('registerClient')
  async registerClient(
    @Body() clientData: { name: string; redirectUris: string[] },
  ) {
    const client = await this.authService.registerClient(
      clientData.name,
      clientData.redirectUris,
    );
    return {
      clientId: client.clientId,
      clientSecret: client.clientSecret,
      name: client.name,
      redirectUris: client.redirectUris,
    };
  }

  @Get('clients')
  async getAllClients() {
    return this.authService.getAllClients();
  }

  @Put('users/:id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: { roles: number[] },
  ) {
    return this.usersService.updateUserRoles(id, updateUserDto.roles);
  }
}
