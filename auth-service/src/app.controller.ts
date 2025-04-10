import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { Public } from './auth/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }
  indexPage(@Req() req: Request, @Res() res: Response) {
    return res.sendFile('index.html', { root: 'public' });
  }
  @Public()
  @Get('/login')
  loginPage(@Res() res: Response) {
    return res.sendFile('login.html', { root: 'public' });
  }
  @Get('html/:file')
  serveHtmlFiles(@Param('file') file: string, @Res() res: Response) {
    return res.sendFile(`${file}`, { root: 'public/html' });
  }
  @Public()
  @Get('static/*')
  serveHtmlFiles2(@Res() res: Response, @Req() req: Request) {
    return res.sendFile(`${req.url}`, { root: 'public' });
  }
}
