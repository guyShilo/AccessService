import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as _ from 'lodash';

@Injectable()
export class AccessService {
  constructor(
    private jwtService: JwtService,
  ) { }
  private readonly logger = new Logger(AccessService.name);
  private readonly today = new Date().toISOString();

  login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  generateKey(userId: string, permissions: [string]) {
    const payload = { sub: userId, permissions };
    const getSignedToken = this.jwtService.sign(payload);

    return {
      access_token: getSignedToken,
    };
  }

  validateToken(token: string) {
    return this.jwtService.verify(token);
  }

  decodeToken(token: string) {
    return this.jwtService.decode(token);
  }

  tokenRecord(token: string) {
    return { token, createdAt: this.today, isActive: true, lastUsed: new Date().toISOString() }
  }
}

