import {
  Controller, Post, Body, HttpException, HttpStatus, HttpCode,
  UsePipes, ValidationPipe, Get, Put, Delete, UseGuards, Req
} from '@nestjs/common';
import { CedulaDeportivaService } from 'core/cedulaDeportiva/cedulaDeportivaService';
import { ResponseBody } from 'api/models/ResponseBody';
import { CrearCedulaDeportivaDto } from './dtos/crearCedulaDeportiva.dto';
import { ActualizarCedulaDeportivaDto } from './dtos/actualizarCedulaDeportiva.dto';
import { EliminarCedulaDeportivaDto } from './dtos/eliminarCedulaDeportiva.dto';
import { AuthGuard } from 'core/auth/guards/auth.guard';
import { PermissionsGuard } from 'core/auth/guards/permissions.guard';
import { Permissions } from 'core/auth/decorators/permissions.decorator';
import { handleException } from 'api/utils/validaciones';

@Controller('cedulaDeportiva')
@UseGuards(AuthGuard) // Todas las rutas requieren autenticación
export class CedulaDeportivaController {
  constructor(private readonly cedulaDeportivaService: CedulaDeportivaService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionsGuard)
  @Permissions('cedula:Crea')
  @UsePipes(new ValidationPipe({
    whitelist: true, transform: true, exceptionFactory: (errors) => {
      const mensajes = errors.map(err => ({
        campo: err.property,
        mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
      }));
      return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
    }
  }))

  async crearCedulaDeportiva(@Body() body: CrearCedulaDeportivaDto): Promise<ResponseBody<string>> {
    try {
      await this.cedulaDeportivaService.CrearCedulaDeportiva(body);
      return new ResponseBody<string>(true, 201, "Se ha creado la cedula deportiva exitosamente");
    } catch (error) {
      handleException(error);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionsGuard)
  @Permissions('cedula:Lee') 
  @UsePipes(new ValidationPipe({
    whitelist: true, transform: true, exceptionFactory: (errors) => {
      const mensajes = errors.map(err => ({
        campo: err.property,
        mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
      }));
      return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
    }
  }))
  async obtenerCedulaDeportiva(@Body() body: EliminarCedulaDeportivaDto): Promise<ResponseBody<any>> {
    try {
      const cedulaDeportiva = await this.cedulaDeportivaService.ObtenerCedulaDeportivaXid(body);

      return new ResponseBody<any>(true, 200, cedulaDeportiva);
    } catch (error) {
      handleException(error);
    }
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionsGuard)
  @Permissions('cedula:Actualiza') 
  @UsePipes(new ValidationPipe({
    whitelist: true, transform: true, exceptionFactory: (errors) => {
      const mensajes = errors.map(err => ({
        campo: err.property,
        mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
      }));
      return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
    }
  }))
  async actualizarCedulaDeportiva(@Body() body: ActualizarCedulaDeportivaDto): Promise<ResponseBody<string>> {

    if (!body.id) throw new HttpException(
      new ResponseBody(false, HttpStatus.BAD_REQUEST, "Debe proporcionar la cedula deportiva a actualizar."),
      HttpStatus.BAD_REQUEST,
    );

    try {
      await this.cedulaDeportivaService.UpCedulaDeportiva(body);
      return new ResponseBody(true, HttpStatus.OK, "Cedula deportiva actualizado exitosamente.");
    } catch (error) {
      handleException(error);
    }
  }

  @Delete()
  @UseGuards(PermissionsGuard)
  @Permissions('cedula:Elimina')
  @UsePipes(new ValidationPipe({
    whitelist: true, transform: true, exceptionFactory: (errors) => {
      const mensajes = errors.map(err => ({
        campo: err.property,
        mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
      }));
      return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
    }
  }))

  async delCedulaDeportiva(@Body() eliminarCedulaDeportivaDto: EliminarCedulaDeportivaDto): Promise<ResponseBody<string>> {
    try {
      await this.cedulaDeportivaService.DelCedulaDeportiva({ id: eliminarCedulaDeportivaDto.id });
      return new ResponseBody(true, 201, "Se ha eliminado la cedula deportiva exitosamente");
    } catch (error) {
      handleException(error);
    }
  }
}
