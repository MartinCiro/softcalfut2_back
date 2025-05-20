import {
  Controller, Post, Body, HttpException, HttpStatus, HttpCode,
  UsePipes, ValidationPipe, Get, Put, Delete, UseGuards, Req
} from '@nestjs/common';
import { RolService } from 'core/roles/rolService';
import { ResponseBody } from 'api/models/ResponseBody';
import { CrearRolDto } from './dtos/crearRol.dto';
import { ObtenerRolesDto } from './dtos/obtenerRol.dto';
import { ActualizarRolDto } from './dtos/actualizarRol.dto';
import { EliminarRolDto } from './dtos/eliminarRol.dto';
import { AuthGuard } from 'core/auth/guards/auth.guard';
import { PermissionsGuard } from 'core/auth/guards/permissions.guard';
import { Permissions } from 'core/auth/decorators/permissions.decorator';
import { handleException } from 'api/utils/validaciones';

@Controller('roles')
@UseGuards(AuthGuard) // Todas las rutas requieren autenticación
export class RolController {
  constructor(private readonly rolService: RolService) { }
  
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionsGuard)
  @Permissions('roles:Crea')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true, exceptionFactory: (errors) => {
    const mensajes = errors.map(err => ({
      campo: err.property,
      mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
    }));
    return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
  }}))

  async crearRol(@Body() body: CrearRolDto): Promise<ResponseBody<string>> {
    try {
      if(body.permisos.length === 0) throw new ResponseBody(false, HttpStatus.BAD_REQUEST, "El rol debe tener al menos un permiso");
      await this.rolService.crearRol(body);
      return new ResponseBody<string>(true, 201, "Se ha creado el rol exitosamente");
    } catch (error) {
      handleException(error);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionsGuard)
  @Permissions('roles:Lee') 
  @UsePipes(new ValidationPipe({
    whitelist: true, transform: true, exceptionFactory: (errors) => {
      const mensajes = errors.map(err => ({
        campo: err.property,
        mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
      }));
      return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
    }
  }))
  async obtenerRoles(@Body() body: ObtenerRolesDto): Promise<ResponseBody<any>> {
    try {
      const roles = body.id
        ? await this.rolService.obtenerRolXid({ id: body.id })
        : await this.rolService.obtenerRoles();

      return new ResponseBody<any>(true, 200, roles);
    } catch (error) {
      handleException(error);
    }
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionsGuard)
  @Permissions('roles:Actualiza') 
  @UsePipes(new ValidationPipe({
    whitelist: true, transform: true, exceptionFactory: (errors) => {
      const mensajes = errors.map(err => ({
        campo: err.property,
        mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
      }));
      return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
    }
  }))
  async actualizarRol(@Body() body: ActualizarRolDto): Promise<ResponseBody<string>> {

    if (!body.id) throw new HttpException(
        new ResponseBody(false, HttpStatus.BAD_REQUEST, "Debe proporcionar al rol a actualizar."),
        HttpStatus.BAD_REQUEST,
      );
    
    if (!body.nombre && !body.descripcion && !body.permisos)throw new HttpException(
        new ResponseBody(false, HttpStatus.BAD_REQUEST, "Debe proporcionar al menos un campo para actualizar."),
        HttpStatus.BAD_REQUEST,
      );

    try {
      await this.rolService.upRol(body);
      return new ResponseBody(true, HttpStatus.OK, "Rol actualizado exitosamente.");
    } catch (error) {
      handleException(error);
    }
  }

  @Delete()
  @UseGuards(PermissionsGuard)
  @Permissions('roles:Elimina')
  @UsePipes(new ValidationPipe({
    whitelist: true, transform: true, exceptionFactory: (errors) => {
      const mensajes = errors.map(err => ({
        campo: err.property,
        mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
      }));
      return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
    }
  }))

  async delRol(@Body() eliminarRolDto: EliminarRolDto): Promise<ResponseBody<string>> {
    try {
      await this.rolService.delRol({ id: eliminarRolDto.id});
      return new ResponseBody(true, 201, "Se ha eliminado el rol exitosamente");
    } catch (error) {
      handleException(error);
    }
  }
}
