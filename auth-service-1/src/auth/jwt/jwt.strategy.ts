import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import * as fs from 'fs';
import * as path from 'path';
import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.access_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey:
        process.env.Symmetric_Encryption === 'true'
          ? process.env.JWT_SECRET_KEY
          : fs.readFileSync(
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
      algorithms: [
        process.env.Symmetric_Encryption === 'true' ? 'HS256' : 'RS256',
      ],
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findOne(payload.username);
    if (!user) {
      throw new UnauthorizedException();
    }
    return { userId: user.userId, username: user.username };
  }
}
