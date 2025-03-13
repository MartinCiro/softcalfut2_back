import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RedisService } from 'shared/cache/redis.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector, private redisService: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler()) || [];
    if (!requiredPermissions.length) return true; 

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userInfo?.id_user;
    
    if (!userId) throw new ForbiddenException('No autenticado');
    
    const userData = await this.redisService.get(`user:${userId}`);
    if (!userData || !userData.permisos) {
      throw new ForbiddenException('No posee permisos para realizar esta acción');
    }
    // Verificar si el usuario tiene al menos uno de los permisos requeridos
    const hasPermission = requiredPermissions.some(permiso => userData.permisos.includes(permiso));

    if (!hasPermission) throw new ForbiddenException('No posee permisos suficientes');

    return true;
  }
}
