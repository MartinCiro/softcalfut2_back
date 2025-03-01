import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { verifyJWT } from '../service/jwtService'; 

// Caché en memoria para almacenar información de usuarios autenticados
const userCache = new Map<string, any>();

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['jwt'] || request.headers['authorization'];

    if (!token) {
      throw new UnauthorizedException('No se ha proporcionado token');
    }

    // Validar formato del token con una expresión regular
    const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
    if (!jwtRegex.test(token)) {
      throw new UnauthorizedException('El token proporcionado no tiene un formato válido');
    }

    try {
      const { userInfo, jwt } = await verifyJWT(token);
      
      // Almacenar usuario en caché
      if (!userInfo.userInfo?.id_user) throw new UnauthorizedException('Token inválido');
      userCache.set(userInfo.userInfo.id_user.toString(), userInfo);

      // Adjuntar la información del usuario a la solicitud
      request.user = userInfo;
      if (jwt) request.newToken = jwt;

      return true;
    } catch (error: any) {
      throw new UnauthorizedException(error.data || 'Token inválido o expirado');
    }
  }

  // Método estático para obtener información del usuario desde la caché
  static getUserInfo(id_user: string) {
    return userCache.get(id_user);
  }
}

