import { Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';

@Injectable()
export class CaptchaService {
  generateCaptcha(): { image: string; code: string } {
    const captcha = svgCaptcha.create({
      size: 4,
      noise: 2,
      color: true,
      background: '#f0f0f0',
      width: 400,
      height: 200,
      fontSize: 240,
    });

    return {
      image: `data:image/svg+xml;base64,${Buffer.from(captcha.data).toString('base64')}`,
      code: captcha.text,
    };
  }
}