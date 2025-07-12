// src/core/auth/services/jwt.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import config from 'src/config';

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly jwtService: NestJwtService
  ) {}

  generateTokens(payload: any) {
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: config.ACCESS_EXPIRES_IN
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: config.JWT_SECRETO,
        expiresIn: config.REFRESH_EXPIRES_IN
      })
    };
  }

  verifyToken(token: string) {
    return this.jwtService.verify(token, {
      secret: config.JWT_SECRETO
    });
  }
}