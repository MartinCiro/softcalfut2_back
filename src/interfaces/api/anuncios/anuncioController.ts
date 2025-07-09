import {
  Controller, Post, Body, HttpException, HttpStatus, HttpCode,
  UsePipes, ValidationPipe, Get, Put, Delete, UseGuards, Req,
  UploadedFile, UseInterceptors
} from '@nestjs/common';
import { AnuncioService } from 'core/anuncios/anuncioService';
import { ResponseBody } from 'api/models/ResponseBody';
import { CrearAnuncioDto } from './dtos/crearAnuncio.dto';
import { ObtenerAnunciosDto } from './dtos/obtenerAnuncio.dto';
import { ActualizarAnuncioDto } from './dtos/actualizarAnuncio.dto';
import { EliminarAnuncioDto } from './dtos/eliminarAnuncio.dto';
import { AuthGuard } from 'core/auth/guards/auth.guard';
import { PermissionsGuard } from 'core/auth/guards/permissions.guard';
import { Permissions, Public } from 'core/auth/decorators/permissions.decorator';
import { handleException } from 'api/utils/validaciones';
import { FileInterceptor } from '@nestjs/platform-express';
import { GitImageUploader } from 'api/utils/GitImageUploader';
import { FormDataRequest } from 'nestjs-form-data';
import { url } from 'inspector';

@Controller('anuncios')
@UseGuards(AuthGuard) // Todas las rutas requieren autenticación
export class AnuncioController {
  constructor(private readonly anuncioService: AnuncioService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionsGuard)
  @Permissions('anuncios:Crea')
  @FormDataRequest()
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
    let url_image = '';
    if (body.imagenUrl) url_image = await GitImageUploader.subirImagen(`${Date.now()}_${(body?.imagenUrl as any).originalName.replace(/\s+/g, "_").toLowerCase()}`, body?.imagenUrl.buffer);
    try {
      await this.anuncioService.crearAnuncio({
        ...body,
        imagenUrl: url_image,
      });
      return new ResponseBody<string>(true, 201, "Se ha creado el anuncio exitosamente");
    } catch (error) {
      handleException(error);
    }
  }

  @Get()
  @Public()
  @UseGuards(PermissionsGuard)
  async obtenerAnuncios(): Promise<ResponseBody<any>> {
    try {
      const anuncios = await this.anuncioService.obtenerAnuncios();

      return new ResponseBody<any>(true, 200, anuncios);
    } catch (error) {
      handleException(error);
    }
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionsGuard)
  @Permissions('anuncios:Actualiza')
  @FormDataRequest()
  @UsePipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    exceptionFactory: (errors) => {
      const mensajes = errors.map(err => ({
        campo: err.property,
        mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
      }));
      return new HttpException(
        new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes),
        HttpStatus.BAD_REQUEST
      );
    }
  }))
  async actualizarAnuncio(
    @Body() body: ActualizarAnuncioDto
  ): Promise<ResponseBody<string>> {
    // Validación de campos a actualizar
    if (!("nombre" in body) && !("contenido" in body) && !("imagenUrl" in body) && !("estado" in body)) {
      throw new HttpException(
        new ResponseBody(false, HttpStatus.BAD_REQUEST, "Debe proporcionar al menos un campo para actualizar."),
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      // Manejo de la imagen
      let url_image: string | undefined;
      
      url_image = body.imagenUrl && typeof body.imagenUrl === "object" ? await GitImageUploader.subirImagen(`${Date.now()}_${(body?.imagenUrl as any).originalName.replace(/\s+/g, "_").toLowerCase()}`, body?.imagenUrl.buffer) : body.imagenUrl;

      // Actualización del anuncio
      await this.anuncioService.upAnuncio({
        ...body,
        imagenUrl: url_image,
      });

      return new ResponseBody(
        true,
        HttpStatus.OK,
        "Anuncio actualizado exitosamente."
      );
    } catch (error) {
      handleException(error);
    }
  }

  @Delete()
  @UseGuards(PermissionsGuard)
  @Permissions('anuncios:Elimina')
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
