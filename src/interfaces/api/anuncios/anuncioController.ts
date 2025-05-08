import {
  Controller, Post, Body, HttpException, HttpStatus, HttpCode,
  UsePipes, ValidationPipe, Get, Put, Delete, UseGuards, Req
} from '@nestjs/common';
import { AnuncioService } from 'core/anuncios/anuncioService';
import { ResponseBody } from 'api/models/ResponseBody';
import { CrearAnuncioDto } from './dtos/crearAnuncio.dto';
import { ObtenerAnunciosDto } from './dtos/obtenerAnuncio.dto';
import { ActualizarAnuncioDto } from './dtos/actualizarAnuncio.dto';
import { EliminarAnuncioDto } from './dtos/eliminarAnuncio.dto';
import { AuthGuard } from 'core/auth/guards/auth.guard';
import { PermissionsGuard } from 'core/auth/guards/permissions.guard';
import { Permissions } from 'core/auth/decorators/permissions.decorator';
import { handleException } from 'api/utils/validaciones';

@Controller('anuncios')
@UseGuards(AuthGuard) // Todas las rutas requieren autenticación
export class AnuncioController {
  constructor(private readonly anuncioService: AnuncioService) { }

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

  async crearAnuncio(@Body() body: CrearAnuncioDto): Promise<ResponseBody<string>> {
    try {
      await this.anuncioService.crearAnuncio(body);
      return new ResponseBody<string>(true, 201, "Se ha creado el anuncio exitosamente");
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
  async obtenerAnuncios(@Body() body: ObtenerAnunciosDto): Promise<ResponseBody<any>> {
    try {
      const anuncios = body.id
        ? await this.anuncioService.obtenerAnuncioXid({ id: body.id })
        : await this.anuncioService.obtenerAnuncios();

      return new ResponseBody<any>(true, 200, anuncios);
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
  async actualizarAnuncio(@Body() body: ActualizarAnuncioDto): Promise<ResponseBody<string>> {

    if (!body.id) throw new HttpException(
      new ResponseBody(false, HttpStatus.BAD_REQUEST, "Debe proporcionar el anuncio a actualizar."),
      HttpStatus.BAD_REQUEST,
    );

    if (!body.nombre) throw new HttpException(
      new ResponseBody(false, HttpStatus.BAD_REQUEST, "Debe proporcionar al menos un campo para actualizar."),
      HttpStatus.BAD_REQUEST,
    );

    try {
      await this.anuncioService.upAnuncio(body);
      return new ResponseBody(true, HttpStatus.OK, "Anuncio actualizado exitosamente.");
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

  async delAnuncio(@Body() eliminarAnuncioDto: EliminarAnuncioDto): Promise<ResponseBody<string>> {
    try {
      await this.anuncioService.delAnuncio({ id: eliminarAnuncioDto.id });
      return new ResponseBody(true, 201, "Se ha eliminado la anuncio exitosamente");
    } catch (error) {
      handleException(error);
    }
  }
}
