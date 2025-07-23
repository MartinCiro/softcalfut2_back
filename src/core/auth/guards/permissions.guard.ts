import { Reflector } from '@nestjs/core';
import { Injectable, CanActivate, ExecutionContext, ForbiddenException, HttpException } from '@nestjs/common';
import { RedisService } from '../../../shared/cache/redis.service';
import { ResponseBody } from '../../../interfaces/api/models/ResponseBody';
import { IS_PUBLIC_KEY  } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector, private redisService: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) return true;

    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler()) || [];
    if (!requiredPermissions.length) return true; 

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.doc;
    
    if (!userId) throw new HttpException(new ResponseBody(false, 401, 'No se ha proporcionado un usuario válido'), 401);
    
    let userData = await this.redisService.get(`user:${userId}`);
    if(typeof userData === 'string') userData = JSON.parse(userData);

    if (!userData || !userData.permisos) throw new HttpException(new ResponseBody(false, 401, 'No posee permisos suficientes para realizar esta accion' ), 401);

    // Verificar si el usuario tiene al menos uno de los permisos requeridos
    const hasPermission = requiredPermissions.some((permiso: String) => userData.permisos.includes(permiso));

    if (!hasPermission) throw new ForbiddenException('No posee permisos suficientes para realizar esta accion');

    return true;
  }
}
