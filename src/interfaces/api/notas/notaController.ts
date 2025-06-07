import {
  Controller, Post, Body, HttpException, HttpStatus, HttpCode,
  UsePipes, ValidationPipe, Get, Put, UseGuards
} from '@nestjs/common';
import { NotaService } from 'core/notas/notaService';
import { ResponseBody } from 'api/models/ResponseBody';
import { CrearNotaDto } from './dtos/crearNota.dto';
import { ObtenerNotasDto } from './dtos/obtenerNota.dto';
import { ActualizarNotaDto } from './dtos/actualizarNota.dto';
import { AuthGuard } from 'core/auth/guards/auth.guard';
import { PermissionsGuard } from 'core/auth/guards/permissions.guard';
import { Permissions } from 'core/auth/decorators/permissions.decorator';
import { handleException } from 'api/utils/validaciones';

@Controller('notas')
@UseGuards(AuthGuard) // Todas las rutas requieren autenticación
export class NotaController {
  constructor(private readonly notaService: NotaService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionsGuard)
  @Permissions('notas:Crea')
  @UsePipes(new ValidationPipe({
    whitelist: true, transform: true, exceptionFactory: (errors) => {
      const mensajes = errors.map(err => ({
        campo: err.property,
        mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
      }));
      return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
    }
  }))

  async crearNota(@Body() body: CrearNotaDto): Promise<ResponseBody<string>> {
    try {
      await this.notaService.crearNota(body);
      return new ResponseBody<string>(true, 201, "Se ha creado el nota exitosamente");
    } catch (error) {
      handleException(error);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionsGuard)
  @Permissions('notas:Lee')
  @UsePipes(new ValidationPipe({
    whitelist: true, transform: true, exceptionFactory: (errors) => {
      const mensajes = errors.map(err => ({
        campo: err.property,
        mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
      }));
      return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
    }
  }))
  async obtenerNotas(@Body() body: ObtenerNotasDto): Promise<ResponseBody<any>> {
    try {
      const notas = await this.notaService.obtenerNotas();
      return new ResponseBody<any>(true, 200, notas);
    } catch (error) {
      handleException(error);
    }
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionsGuard)
  @Permissions('notas:Actualiza')
  @UsePipes(new ValidationPipe({
    whitelist: true, transform: true, exceptionFactory: (errors) => {
      const mensajes = errors.map(err => ({
        campo: err.property,
        mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
      }));
      return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
    }
  }))
  async actualizarNota(@Body() body: ActualizarNotaDto): Promise<ResponseBody<string>> {

    if (!body.nombre && !body.descripcion) throw new HttpException(
      new ResponseBody(false, HttpStatus.BAD_REQUEST, "Debe proporcionar al menos un campo para actualizar."),
      HttpStatus.BAD_REQUEST,
    );

    try {
      await this.notaService.upNota(body);
      return new ResponseBody(true, HttpStatus.OK, "Nota actualizado exitosamente.");
    } catch (error) {
      handleException(error);
    }
  }
}
