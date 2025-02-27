import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';
import config from '../../../config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['jwt'] || request.headers['authorization'];

    if (!token) {
      throw new UnauthorizedException('No se ha proporcionado token');
    }

    // Validar formato del token
    const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
    if (!jwtRegex.test(token)) {
      throw new UnauthorizedException('No se ha proporcionado un token válido');
    }

    try {
      const decoded = jwt.verify(token, config.JWT_SECRETO as string);
      request.user = decoded; 
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
