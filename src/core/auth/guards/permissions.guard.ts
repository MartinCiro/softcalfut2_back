import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler()) || [];

    if (!requiredPermissions.length) return true; // Si no se requieren permisos, permitir el acceso

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Extraer el usuario del JWT

    console.log("Usuario autenticado en PermissionsGuard:", user);

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
