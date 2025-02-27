import { Controller, Post, Body, HttpException, HttpStatus, HttpCode, UsePipes, ValidationPipe, Get, Put, Delete } from '@nestjs/common';
import { RolxPermisoService } from '../../../core/rolXpermisos/rolXpermisoService';
import { ResponseBody } from '../models/ResponseBody';
import { CrearRolxPermisoDto } from './dtos/crearRolxPermiso.dto';
import { ObtenerRolxPermisosDto } from './dtos/obtenerRolxPermiso.dto';

@Controller('rolXpermiso')
export class RolxPermisoController {
  constructor(private readonly rolxPermisoService: RolxPermisoService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true })) // Aplica validaciones automáticas
  async crearRolxPermiso(@Body() body: CrearRolxPermisoDto): Promise<ResponseBody<string>> {
    try {
      await this.rolxPermisoService.crearRolxPermisos(body);
      return new ResponseBody<string>(true, 201, "Se ha creado el rolxPermiso exitosamente");
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'status_cod' in error && 'data' in error) {
        const err = error as { status_cod: unknown; data: unknown };
        const statusCode = typeof err.status_cod === 'number' ? err.status_cod : HttpStatus.INTERNAL_SERVER_ERROR;
        const data = typeof err.data === 'string' ? err.data : 'Error desconocido';

        throw new HttpException(new ResponseBody(false, statusCode, data), statusCode);
      }

      throw new HttpException(new ResponseBody(false, HttpStatus.INTERNAL_SERVER_ERROR, 'Error interno del servidor'), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))

  async obtenerRolxPermisos(@Body() body: ObtenerRolxPermisosDto): Promise<ResponseBody<any>> {
    try {
      const { id_rol } = body;

      // Si no se pasa el id_rol, obtenemos todos los rolxPermisos
      const rolxPermisos = id_rol
        ? await this.rolxPermisoService.obtenerRolxPermisoXid({ id_rol })
        : await this.rolxPermisoService.obtenerRolxPermisos();

      return new ResponseBody<any>(true, 200, rolxPermisos);
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'status_cod' in error && 'data' in error) {
        const err = error as { status_cod: unknown; data: unknown };
        const statusCode = typeof err.status_cod === 'number' ? err.status_cod : HttpStatus.INTERNAL_SERVER_ERROR;
        const data = typeof err.data === 'string' ? err.data : 'Error desconocido';

        throw new HttpException(new ResponseBody(false, statusCode, data), statusCode);
      }

      throw new HttpException(new ResponseBody(false, HttpStatus.INTERNAL_SERVER_ERROR, 'Error interno del servidor'), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}