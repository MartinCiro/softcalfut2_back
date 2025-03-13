import {
  Controller, Post, Body, HttpException, HttpStatus, HttpCode,
  UsePipes, ValidationPipe, Get, Put, Delete, UseGuards, Req
} from '@nestjs/common';
import { PermisoService } from 'core/permisos/permisoService';
import { ResponseBody } from 'api/models/ResponseBody';
import { CrearPermisoDto } from './dtos/crearPermiso.dto';
import { ObtenerPermisosDto } from './dtos/obtenerPermiso.dto';
import { ActualizarPermisoDto } from './dtos/actualizarPermiso.dto';
import { EliminarPermisoDto } from './dtos/eliminarPermiso.dto';
import { AuthGuard } from 'core/auth/guards/auth.guard';
import { PermissionsGuard } from 'core/auth/guards/permissions.guard';
import { Permissions } from 'core/auth/decorators/permissions.decorator';

@Controller('permisos')
@UseGuards(AuthGuard) // Todas las rutas requieren autenticación
export class PermisoController {
  constructor(private readonly permisoService: PermisoService) { }
  
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionsGuard)
  @Permissions('Escritura')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true, exceptionFactory: (errors) => {
    const mensajes = errors.map(err => ({
      campo: err.property,
      mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
    }));
    return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
  }}))
  
  async crearPermiso(@Body() body: CrearPermisoDto): Promise<ResponseBody<string>> {
    try {
      await this.permisoService.crearPermiso(body);
      return new ResponseBody<string>(true, 201, "Se ha creado el permiso exitosamente");
    } catch (error) {
      this.handleException(error);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionsGuard)
  @Permissions('Lectura')
  @UsePipes(new ValidationPipe({
    whitelist: true, transform: true, exceptionFactory: (errors) => {
      const mensajes = errors.map(err => ({
        campo: err.property,
        mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
      }));
      return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
    }
  }))
  async obtenerPermisos(@Body() body: ObtenerPermisosDto): Promise<ResponseBody<any>> {
    try {
      const permisos = body.id
        ? await this.permisoService.obtenerPermisoXid({ id: Number(body.id) })
        : await this.permisoService.obtenerPermisos();

      return new ResponseBody<any>(true, 200, permisos);
    } catch (error) {
      this.handleException(error);
    }
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionsGuard)
  @Permissions('Actualizacion')
  @UsePipes(new ValidationPipe({
    whitelist: true, transform: true, exceptionFactory: (errors) => {
      const mensajes = errors.map(err => ({
        campo: err.property,
        mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
      }));
      return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
    }
  }))
  async actualizarPermiso(@Body() body: ActualizarPermisoDto): Promise<ResponseBody<string>> {
    if (!body.apellidos && !body.nombres && !body.id_rol && !body.id_estado && !body.username && !body.id) {
      throw new HttpException(
        new ResponseBody(false, HttpStatus.BAD_REQUEST, "Debe proporcionar al menos un campo para actualizar."),
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      await this.permisoService.upPermiso(body);
      return new ResponseBody(true, HttpStatus.OK, "Permiso actualizado exitosamente.");
    } catch (error) {
      this.handleException(error);
    }
  }

  @Delete()
  @UseGuards(PermissionsGuard)
  @Permissions('Elimina')
  @UsePipes(new ValidationPipe({
    whitelist: true, transform: true, exceptionFactory: (errors) => {
      const mensajes = errors.map(err => ({
        campo: err.property,
        mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
      }));
      return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
    }
  }))

  async delPermiso(@Body() eliminarPermisoDto: EliminarPermisoDto): Promise<ResponseBody<string>> {
    try {
      await this.permisoService.delPermiso({ id: eliminarPermisoDto.id});
      return new ResponseBody(true, 201, "Se ha eliminado el permiso exitosamente");
    } catch (error) {
      this.handleException(error);
    }
  }

  /**
   * 📌 Manejo centralizado de errores
   */
  private handleException(error: any): never {
    if (typeof error === 'object' && error !== null && 'status_cod' in error && 'data' in error) {
      const statusCode = typeof error.status_cod === 'number' ? error.status_cod : HttpStatus.INTERNAL_SERVER_ERROR;
      const data = typeof error.data === 'string' ? error.data : 'Error desconocido';
      throw new HttpException(new ResponseBody(false, statusCode, data), statusCode);
    }
    throw new HttpException(new ResponseBody(false, HttpStatus.INTERNAL_SERVER_ERROR, 'Error interno del servidor'), HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
