import { Controller, Get, Res, Session } from '@nestjs/common';
import { Response } from 'express';
import { CaptchaService } from './captcha.service';
import { Public } from './public.decorator';
import { v4 as uuidv4 } from 'uuid'; // 引入 UUID 库

@Controller('getCaptcha')
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {}

  @Public()
  @Get()
  getCaptcha(@Res() res: Response, @Session() session: any) {
    const { image, code } = this.captchaService.generateCaptcha();
    const captchaId = uuidv4(); // 生成一个临时标识符
    session.captchaCodes = session.captchaCodes || {};
    session.captchaCodes[captchaId] = code; // 存储临时标识符和验证码的映射
    res.json({ image, captchaId }); // 返回临时标识符
  }
}
