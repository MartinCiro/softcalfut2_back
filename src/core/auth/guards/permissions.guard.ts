import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler()) || [];
    if (!requiredPermissions.length) return true; 

    const request = context.switchToHttp().getRequest();

    const userCacheData = AuthGuard.getUserInfo(request?.user?.userInfo?.id_user);
    const user = userCacheData?.userInfo;

    if (!user || !user.permisos) {
      throw new ForbiddenException('No posee permisos para realizar esta acción');
    }

    // Verificar si el usuario tiene al menos uno de los permisos requeridos
    const hasPermission = requiredPermissions.some(permiso => user.permisos.includes(permiso));

    if (!hasPermission) {
      throw new ForbiddenException('No posee permisos suficientes');
    }

    return true;
  }
}
