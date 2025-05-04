import {
  Controller, Post, Body, HttpException, HttpStatus, HttpCode,
  UsePipes, ValidationPipe, Get, Put, Delete, UseGuards, Req
} from '@nestjs/common';
import { CategoriaService } from 'core/categorias/categoriaService';
import { ResponseBody } from 'api/models/ResponseBody';
import { CrearCategoriaDto } from './dtos/crearCategoria.dto';
import { ObtenerCategoriasDto } from './dtos/obtenerCategoria.dto';
import { ActualizarCategoriaDto } from './dtos/actualizarCategoria.dto';
import { EliminarCategoriaDto } from './dtos/eliminarCategoria.dto';
import { AuthGuard } from 'core/auth/guards/auth.guard';
import { PermissionsGuard } from 'core/auth/guards/permissions.guard';
import { Permissions } from 'core/auth/decorators/permissions.decorator';
import { handleException } from 'api/utils/validaciones';

@Controller('categorias')
@UseGuards(AuthGuard) // Todas las rutas requieren autenticación
export class CategoriaController {
  constructor(private readonly rolService: CategoriaService) { }

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

  async crearCategoria(@Body() body: CrearCategoriaDto): Promise<ResponseBody<string>> {
    try {
      await this.rolService.crearCategoria(body);
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
  async obtenerCategorias(@Body() body: ObtenerCategoriasDto): Promise<ResponseBody<any>> {
    try {
      const categorias = body.id
        ? await this.rolService.obtenerCategoriaXid({ id: body.id })
        : await this.rolService.obtenerCategorias();

      return new ResponseBody<any>(true, 200, categorias);
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
  async actualizarCategoria(@Body() body: ActualizarCategoriaDto): Promise<ResponseBody<string>> {

    if (!body.id) throw new HttpException(
      new ResponseBody(false, HttpStatus.BAD_REQUEST, "Debe proporcionar el rol a actualizar."),
      HttpStatus.BAD_REQUEST,
    );

    if (!body.nombre) throw new HttpException(
      new ResponseBody(false, HttpStatus.BAD_REQUEST, "Debe proporcionar al menos un campo para actualizar."),
      HttpStatus.BAD_REQUEST,
    );

    try {
      await this.rolService.upCategoria(body);
      return new ResponseBody(true, HttpStatus.OK, "Categoria actualizado exitosamente.");
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

  async delCategoria(@Body() eliminarCategoriaDto: EliminarCategoriaDto): Promise<ResponseBody<string>> {
    try {
      await this.rolService.delCategoria({ id: eliminarCategoriaDto.id });
      return new ResponseBody(true, 201, "Se ha eliminado la categoria exitosamente");
    } catch (error) {
      handleException(error);
    }
  }
}
