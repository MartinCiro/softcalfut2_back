import {
  Controller, Post, Body, HttpException, HttpStatus, HttpCode,
  UsePipes, ValidationPipe, Get, Put, Delete, UseGuards, Req
} from '@nestjs/common';
import { EstadoService } from 'core/estados/estadoService';
import { ResponseBody } from 'api/models/ResponseBody';
import { CrearEstadoDto } from './dtos/crearEstado.dto';
import { ObtenerEstadosDto } from './dtos/obtenerEstado.dto';
import { ActualizarEstadoDto } from './dtos/actualizarEstado.dto';
import { EliminarEstadoDto } from './dtos/eliminarEstado.dto';
import { AuthGuard } from 'core/auth/guards/auth.guard';
import { PermissionsGuard } from 'core/auth/guards/permissions.guard';
import { Permissions } from 'core/auth/decorators/permissions.decorator';
import { handleException } from 'api/utils/validaciones';

@Controller('estados')
@UseGuards(AuthGuard) // Todas las rutas requieren autenticación
export class EstadoController {
  constructor(private readonly rolService: EstadoService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionsGuard)
  @Permissions('Crea')
  @UsePipes(new ValidationPipe({
    whitelist: true, transform: true, exceptionFactory: (errors) => {
      const mensajes = errors.map(err => ({
        campo: err.property,
        mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
      }));
      return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
    }
  }))

  async crearEstado(@Body() body: CrearEstadoDto): Promise<ResponseBody<string>> {
    try {
      await this.rolService.crearEstado(body);
      return new ResponseBody<string>(true, 201, "Se ha creado el rol exitosamente");
    } catch (error) {
      handleException(error);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionsGuard)
  @Permissions('Lee') 
  @UsePipes(new ValidationPipe({
    whitelist: true, transform: true, exceptionFactory: (errors) => {
      const mensajes = errors.map(err => ({
        campo: err.property,
        mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
      }));
      return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
    }
  }))
  async obtenerEstados(@Body() body: ObtenerEstadosDto): Promise<ResponseBody<any>> {
    try {
      const estados = body.id
        ? await this.rolService.obtenerEstadoXid({ id: body.id })
        : await this.rolService.obtenerEstados();

      return new ResponseBody<any>(true, 200, estados);
    } catch (error) {
      handleException(error);
    }
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionsGuard)
  @Permissions('Actualiza') 
  @UsePipes(new ValidationPipe({
    whitelist: true, transform: true, exceptionFactory: (errors) => {
      const mensajes = errors.map(err => ({
        campo: err.property,
        mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
      }));
      return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
    }
  }))
  async actualizarEstado(@Body() body: ActualizarEstadoDto): Promise<ResponseBody<string>> {

    if (!body.id) throw new HttpException(
      new ResponseBody(false, HttpStatus.BAD_REQUEST, "Debe proporcionar el rol a actualizar."),
      HttpStatus.BAD_REQUEST,
    );

    if (!body.nombre && !body.descripcion) throw new HttpException(
      new ResponseBody(false, HttpStatus.BAD_REQUEST, "Debe proporcionar al menos un campo para actualizar."),
      HttpStatus.BAD_REQUEST,
    );

    try {
      await this.rolService.upEstado(body);
      return new ResponseBody(true, HttpStatus.OK, "Estado actualizado exitosamente.");
    } catch (error) {
      handleException(error);
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

  async delEstado(@Body() eliminarEstadoDto: EliminarEstadoDto): Promise<ResponseBody<string>> {
    try {
      await this.rolService.delEstado({ id: eliminarEstadoDto.id });
      return new ResponseBody(true, 201, "Se ha eliminado el rol exitosamente");
    } catch (error) {
      handleException(error);
    }
  }
}
