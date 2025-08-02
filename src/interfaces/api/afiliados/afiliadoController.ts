import {
  Controller, Post, Body, HttpException, HttpStatus, HttpCode,
  UsePipes, ValidationPipe, Get, Put, UseGuards
} from '@nestjs/common';
import { AfiliadoService } from '@core/afiliados/afiliadoService';
import { ResponseBody } from '@api/models/ResponseBody';
import { CrearAfiliadoDto } from './dtos/crearAfiliado.dto';
import { ObtenerAfiliadosDto } from './dtos/obtenerAfiliado.dto';
import { ActualizarAfiliadoDto } from './dtos/actualizarAfiliado.dto';
import { AuthGuard } from '@core/auth/guards/auth.guard';
import { PermissionsGuard } from '@core/auth/guards/permissions.guard';
import { Permissions } from '@core/auth/decorators/permissions.decorator';
import { handleException } from '@utils/validaciones';

@Controller('afiliados')
@UseGuards(AuthGuard) // Todas las rutas requieren autenticación
export class AfiliadoController {
  constructor(private readonly afiliadoService: AfiliadoService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionsGuard)
  @Permissions('afiliados:Crea')
  @UsePipes(new ValidationPipe({
    whitelist: true, transform: true, exceptionFactory: (errors) => {
      const mensajes = errors.map(err => ({
        campo: err.property,
        mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
      }));
      return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
    }
  }))

  async crearAfiliado(@Body() body: CrearAfiliadoDto): Promise<ResponseBody<string>> {
    try {
      await this.afiliadoService.crearAfiliado(body);
      return new ResponseBody<string>(true, 201, "Se ha creado el afiliado exitosamente");
    } catch (error) {
      handleException(error);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionsGuard)
  @Permissions('afiliados:Lee')
  @UsePipes(new ValidationPipe({
    whitelist: true, transform: true, exceptionFactory: (errors) => {
      const mensajes = errors.map(err => ({
        campo: err.property,
        mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
      }));
      return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
    }
  }))
  async obtenerAfiliados(): Promise<ResponseBody<any>> {
    try {
      const afiliados = await this.afiliadoService.obtenerAfiliados();
      return new ResponseBody<any>(true, 200, afiliados);
    } catch (error) {
      handleException(error);
    }
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionsGuard)
  @Permissions('afiliados:Actualiza')
  @UsePipes(new ValidationPipe({
    whitelist: true, transform: true, exceptionFactory: (errors) => {
      const mensajes = errors.map(err => ({
        campo: err.property,
        mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
      }));
      return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
    }
  }))
  async actualizarAfiliado(@Body() body: ActualizarAfiliadoDto): Promise<ResponseBody<string>> {

    if (!body.nom_afiliado && !body.encargado && (!body.jugadores || body.jugadores.length === 0) && !body.categoria) throw new HttpException(
      new ResponseBody(false, HttpStatus.BAD_REQUEST, "Debe proporcionar al menos un campo para actualizar."),
      HttpStatus.BAD_REQUEST,
    );

    try {
      await this.afiliadoService.upAfiliado(body);
      return new ResponseBody(true, HttpStatus.OK, "Afiliado actualizado exitosamente.");
    } catch (error) {
      handleException(error);
    }
  }
}
