import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { verifyToken } from 'core/auth/service/jwtService';
import { ResponseBody } from 'api/models/ResponseBody';
import { IS_PUBLIC_KEY } from 'core/auth/decorators/permissions.decorator';

// Caché en memoria para usuarios autenticados
const userCache = new Map<string, any>();

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler());
    const request = context.switchToHttp().getRequest();

    try {
      const { userInfo, newAccessToken } = await verifyToken(token);

      // Almacenar usuario en caché
      if (!userInfo.userInfo?.doc) {
        const error = new UnauthorizedException('Token inválido');
        throw new HttpException(
          new ResponseBody(false, 404, error.message),
          404
        );
      }
      userCache.set(userInfo.userInfo.doc.toString(), userInfo);

      // Adjuntar la información del usuario a la solicitud
      request.user = userInfo;
      if (newAccessToken) request.newToken = newAccessToken;

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
