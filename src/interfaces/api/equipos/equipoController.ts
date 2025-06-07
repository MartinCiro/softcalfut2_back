import {
  Controller, Post, Body, HttpException, HttpStatus, HttpCode,
  UsePipes, ValidationPipe, Get, Put, UseGuards
} from '@nestjs/common';
import { EquipoService } from 'core/equipos/equipoService';
import { ResponseBody } from 'api/models/ResponseBody';
import { CrearEquipoDto } from './dtos/crearEquipo.dto';
import { ObtenerEquiposDto } from './dtos/obtenerEquipo.dto';
import { ActualizarEquipoDto } from './dtos/actualizarEquipo.dto';
import { AuthGuard } from 'core/auth/guards/auth.guard';
import { PermissionsGuard } from 'core/auth/guards/permissions.guard';
import { Permissions } from 'core/auth/decorators/permissions.decorator';
import { handleException } from 'api/utils/validaciones';

@Controller('equipos')
@UseGuards(AuthGuard) // Todas las rutas requieren autenticación
export class EquipoController {
  constructor(private readonly equipoService: EquipoService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionsGuard)
  @Permissions('equipos:Crea')
  @UsePipes(new ValidationPipe({
    whitelist: true, transform: true, exceptionFactory: (errors) => {
      const mensajes = errors.map(err => ({
        campo: err.property,
        mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
      }));
      return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
    }
  }))

  async crearEquipo(@Body() body: CrearEquipoDto): Promise<ResponseBody<string>> {
    try {
      await this.equipoService.crearEquipo(body);
      return new ResponseBody<string>(true, 201, "Se ha creado el equipo exitosamente");
    } catch (error) {
      handleException(error);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionsGuard)
  @Permissions('equipos:Lee')
  @UsePipes(new ValidationPipe({
    whitelist: true, transform: true, exceptionFactory: (errors) => {
      const mensajes = errors.map(err => ({
        campo: err.property,
        mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
      }));
      return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
    }
  }))
  async obtenerEquipos(@Body() body: ObtenerEquiposDto): Promise<ResponseBody<any>> {
    try {
      const equipos = await this.equipoService.obtenerEquipos();
      return new ResponseBody<any>(true, 200, equipos);
    } catch (error) {
      handleException(error);
    }
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionsGuard)
  @Permissions('equipos:Actualiza')
  @UsePipes(new ValidationPipe({
    whitelist: true, transform: true, exceptionFactory: (errors) => {
      const mensajes = errors.map(err => ({
        campo: err.property,
        mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
      }));
      return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
    }
  }))
  async actualizarEquipo(@Body() body: ActualizarEquipoDto): Promise<ResponseBody<string>> {

    if (!body.nom_equipo && !body.encargado && (!body.jugadores || body.jugadores.length === 0) && !body.categoria) throw new HttpException(
      new ResponseBody(false, HttpStatus.BAD_REQUEST, "Debe proporcionar al menos un campo para actualizar."),
      HttpStatus.BAD_REQUEST,
    );

    try {
      await this.equipoService.upEquipo(body);
      return new ResponseBody(true, HttpStatus.OK, "Equipo actualizado exitosamente.");
    } catch (error) {
      handleException(error);
    }
  }
}
