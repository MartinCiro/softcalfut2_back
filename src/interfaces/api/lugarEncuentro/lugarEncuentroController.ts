import {
  Controller, Post, Body, HttpException, HttpStatus, HttpCode,
  UsePipes, ValidationPipe, Get, Put, UseGuards
} from '@nestjs/common';
import { LugarEncuentroService } from 'core/lugarEncuentro/lugarEncuentroService';
import { ResponseBody } from 'api/models/ResponseBody';
import { CrearLugarEncuentroDto } from './dtos/crearLugarEncuentro.dto';
import { ObtenerLugarEncuentroDto } from './dtos/obtenerLugarEncuentro.dto';
import { ActualizarLugarEncuentroDto } from './dtos/actualizarLugarEncuentro.dto';
import { AuthGuard } from 'core/auth/guards/auth.guard';
import { PermissionsGuard } from 'core/auth/guards/permissions.guard';
import { Permissions } from 'core/auth/decorators/permissions.decorator';
import { handleException } from 'api/utils/validaciones';

@Controller('lugarEncuentro')
@UseGuards(AuthGuard) // Todas las rutas requieren autenticación
export class LugarEncuentroController {
  constructor(private readonly lugarEncuentroService: LugarEncuentroService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionsGuard)
  @Permissions('lugarEncuentro:Crea')
  @UsePipes(new ValidationPipe({
    whitelist: true, transform: true, exceptionFactory: (errors) => {
      const mensajes = errors.map(err => ({
        campo: err.property,
        mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
      }));
      return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
    }
  }))

  async crearLugarEncuentro(@Body() body: CrearLugarEncuentroDto): Promise<ResponseBody<string>> {
    try {
      await this.lugarEncuentroService.crearLugarEncuentro(body);
      return new ResponseBody<string>(true, 201, "Se ha creado el lugarEncuentro exitosamente");
    } catch (error) {
      handleException(error);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionsGuard)
  @Permissions('lugarEncuentro:Lee')
  @UsePipes(new ValidationPipe({
    whitelist: true, transform: true, exceptionFactory: (errors) => {
      const mensajes = errors.map(err => ({
        campo: err.property,
        mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
      }));
      return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
    }
  }))
  async obtenerlugarEncuentro(@Body() body: ObtenerLugarEncuentroDto): Promise<ResponseBody<any>> {
    try {
      const lugarEncuentro = await this.lugarEncuentroService.obtenerLugarEncuentro();
      return new ResponseBody<any>(true, 200, lugarEncuentro);
    } catch (error) {
      handleException(error);
    }
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionsGuard)
  @Permissions('lugarEncuentro:Actualiza')
  @UsePipes(new ValidationPipe({
    whitelist: true, transform: true, exceptionFactory: (errors) => {
      const mensajes = errors.map(err => ({
        campo: err.property,
        mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
      }));
      return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
    }
  }))
  async actualizarLugarEncuentro(@Body() body: ActualizarLugarEncuentroDto): Promise<ResponseBody<string>> {

    if (!body.nombre && !body.direccion) throw new HttpException(
      new ResponseBody(false, HttpStatus.BAD_REQUEST, "Debe proporcionar al menos un campo para actualizar."),
      HttpStatus.BAD_REQUEST,
    );

    try {
      await this.lugarEncuentroService.upLugarEncuentro(body);
      return new ResponseBody(true, HttpStatus.OK, "LugarEncuentro actualizado exitosamente.");
    } catch (error) {
      handleException(error);
    }
  }
}
