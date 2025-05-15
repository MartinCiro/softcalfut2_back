import {
  Controller, Post, Body, HttpException, HttpStatus, HttpCode,
  UsePipes, ValidationPipe, Get, Put, Delete, UseGuards, Req
} from '@nestjs/common';
import { TorneoService } from 'core/torneos/torneoService';
import { ResponseBody } from 'api/models/ResponseBody';
import { CrearTorneoDto } from './dtos/crearTorneo.dto';
import { ObtenerTorneosDto } from './dtos/obtenerTorneo.dto';
import { ActualizarTorneoDto } from './dtos/actualizarTorneo.dto';
import { EliminarTorneoDto } from './dtos/eliminarTorneo.dto';
import { AuthGuard } from 'core/auth/guards/auth.guard';
import { PermissionsGuard } from 'core/auth/guards/permissions.guard';
import { Permissions } from 'core/auth/decorators/permissions.decorator';
import { handleException } from 'api/utils/validaciones';

@Controller('torneos')
@UseGuards(AuthGuard) // Todas las rutas requieren autenticación
export class TorneoController {
  constructor(private readonly rolService: TorneoService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionsGuard)
  @Permissions('torneos:Crea')
  @UsePipes(new ValidationPipe({
    whitelist: true, transform: true, exceptionFactory: (errors) => {
      const mensajes = errors.map(err => ({
        campo: err.property,
        mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
      }));
      return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
    }
  }))

  async crearTorneo(@Body() body: CrearTorneoDto): Promise<ResponseBody<string>> {
    try {
      await this.rolService.crearTorneo(body);
      return new ResponseBody<string>(true, 201, "Se ha creado el torneo exitosamente");
    } catch (error) {
      handleException(error);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionsGuard)
  @Permissions('torneos:Lee') 
  @UsePipes(new ValidationPipe({
    whitelist: true, transform: true, exceptionFactory: (errors) => {
      const mensajes = errors.map(err => ({
        campo: err.property,
        mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
      }));
      return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
    }
  }))
  async obtenerTorneos(@Body() body: ObtenerTorneosDto): Promise<ResponseBody<any>> {
    try {
      const torneos = body.id
        ? await this.rolService.obtenerTorneoXid({ id: body.id })
        : await this.rolService.obtenerTorneos();

      return new ResponseBody<any>(true, 200, torneos);
    } catch (error) {
      handleException(error);
    }
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionsGuard)
  @Permissions('torneos:Actualiza') 
  @UsePipes(new ValidationPipe({
    whitelist: true, transform: true, exceptionFactory: (errors) => {
      const mensajes = errors.map(err => ({
        campo: err.property,
        mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
      }));
      return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
    }
  }))
  async actualizarTorneo(@Body() body: ActualizarTorneoDto): Promise<ResponseBody<string>> {

    if (!body.id) throw new HttpException(
      new ResponseBody(false, HttpStatus.BAD_REQUEST, "Debe proporcionar el torneo a actualizar."),
      HttpStatus.BAD_REQUEST,
    );

    if (!body.nombre) throw new HttpException(
      new ResponseBody(false, HttpStatus.BAD_REQUEST, "Debe proporcionar al menos un campo para actualizar."),
      HttpStatus.BAD_REQUEST,
    );

    try {
      await this.rolService.upTorneo(body);
      return new ResponseBody(true, HttpStatus.OK, "Torneo actualizado exitosamente.");
    } catch (error) {
      handleException(error);
    }
  }

  @Delete()
  @UseGuards(PermissionsGuard)
  @Permissions('torneos:Elimina')
  @UsePipes(new ValidationPipe({
    whitelist: true, transform: true, exceptionFactory: (errors) => {
      const mensajes = errors.map(err => ({
        campo: err.property,
        mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
      }));
      return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
    }
  }))

  async delTorneo(@Body() eliminarTorneoDto: EliminarTorneoDto): Promise<ResponseBody<string>> {
    try {
      await this.rolService.delTorneo({ id: eliminarTorneoDto.id });
      return new ResponseBody(true, 201, "Se ha eliminado la torneo exitosamente");
    } catch (error) {
      handleException(error);
    }
  }
}
