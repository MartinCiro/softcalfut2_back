import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { verifyJWT } from '../service/jwtService';
import { ResponseBody } from '../../../interfaces/api/models/ResponseBody';
import { IS_PUBLIC_KEY } from '../decorators/permissions.decorator';

// Caché en memoria para usuarios autenticados
const userCache = new Map<string, any>();

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler());
    const request = context.switchToHttp().getRequest();

    try {
      const rawToken = request.headers['jwt'] || request.headers['authorization'];

      if (rawToken) {
        const token = rawToken.startsWith('Bearer ') ? rawToken.slice(7) : rawToken;

        const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
        if (!jwtRegex.test(token)) {
          if (!isPublic) throw new UnauthorizedException('El token proporcionado no tiene un formato válido');
        } else {
          const { userInfo, jwt } = await verifyJWT(token);

          if (!userInfo?.doc) {
            if (!isPublic) throw new UnauthorizedException('Token inválido');
          } else {
            request.user = userInfo;
            if (jwt) request.newToken = jwt;
            userCache.set(userInfo.doc.toString(), userInfo);
          }
        }
      } else if (!isPublic) throw new UnauthorizedException('No se ha proporcionado token');

      return true;
    } catch (error: any) {
      console.error('❌ error en AuthGuard:', error?.message || error);

      const exception = new UnauthorizedException(error?.message || 'Token inválido o expirado');
      throw new HttpException(
        new ResponseBody(false, 401, exception.message),
        404
      );
    }
  }
}
