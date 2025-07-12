import {
  Controller, Post, Body, HttpException, HttpStatus, HttpCode,
  UsePipes, ValidationPipe, Get, Put, Delete, UseGuards, Req
} from '@nestjs/common';
import { ProgramacionService } from 'core/programaciones/programacionService';
import { ResponseBody } from 'api/models/ResponseBody';
import { CrearProgramacionDto } from './dtos/crearProgramacion.dto';
import { ObtenerProgramacionesDto } from './dtos/obtenerProgramacion.dto';
import { ActualizaProgramacionDto } from './dtos/actualizarProgramacion.dto';
import { EliminarProgramacionDto } from './dtos/eliminarProgramacion.dto';
import { AuthGuard } from 'core/auth/guards/auth.guard';
import { PermissionsGuard } from 'core/auth/guards/permissions.guard';
import { Permissions, Public } from 'core/auth/decorators/permissions.decorator';
import { handleException } from 'api/utils/validaciones';
import { User } from 'core/auth/decorators/user.decorator';

@Controller('programacion')
@UseGuards(AuthGuard) // Todas las rutas requieren autenticación
export class ProgramacionController {
  constructor(private readonly programacionService: ProgramacionService) { }
    @Get()
  @HttpCode(HttpStatus.OK)
  @Public()
  @UseGuards(PermissionsGuard)
  async obtenerProgramaciones(@User() user?: any): Promise<ResponseBody<any>> {
    try {
      const programaciones = await this.programacionService.obtenerProgramaciones(user?.doc, user?.rol);
      return new ResponseBody<any>(true, 200, programaciones);
    } catch (error) {
      handleException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionsGuard)
  @Permissions('programaciones:Crea')
  @UsePipes(new ValidationPipe({
    whitelist: true, transform: true, exceptionFactory: (errors) => {
      const mensajes = errors.map(err => ({
        campo: err.property,
        mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
      }));
      return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
    }
  }))

  async crearProgramacion(@Body() body: CrearProgramacionDto): Promise<ResponseBody<string>> {
    try {
      await this.programacionService.crearProgramacion(body);
      return new ResponseBody<string>(true, 201, "Se ha la programacion exitosamente");
    } catch (error) {
      handleException(error);
    }
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionsGuard)
  @Permissions('programaciones:Actualiza') 
  @UsePipes(new ValidationPipe({
    whitelist: true, transform: true, exceptionFactory: (errors) => {
      const mensajes = errors.map(err => ({
        campo: err.property,
        mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
      }));
      return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
    }
  }))
  async actualizarProgramacion(@Body() body: ActualizaProgramacionDto): Promise<ResponseBody<string>> {

    if (!body.rama && !body.fecha && !body.lugar && !body.competencia && !body.equipoLocal && !body.equipoVisitante && !body.torneo && !body.categoria) throw new HttpException(
      new ResponseBody(false, HttpStatus.BAD_REQUEST, "Debe proporcionar al menos un campo para actualizar."),
      HttpStatus.BAD_REQUEST,
    );

    try {
      await this.programacionService.upProgramacion(body);
      return new ResponseBody(true, HttpStatus.OK, "Programacion actualizado exitosamente.");
    } catch (error) {
      handleException(error);
    }
  }

  @Delete()
  @UseGuards(PermissionsGuard)
  @Permissions('programaciones:Elimina')
  @UsePipes(new ValidationPipe({
    whitelist: true, transform: true, exceptionFactory: (errors) => {
      const mensajes = errors.map(err => ({
        campo: err.property,
        mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
      }));
      return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
    }
  }))

  async delProgramacion(@Body() eliminarProgramacionDto: EliminarProgramacionDto): Promise<ResponseBody<string>> {
    try {
      await this.programacionService.delProgramacion({ id: eliminarProgramacionDto.id });
      return new ResponseBody(true, 201, "Se ha eliminado la programacion exitosamente");
    } catch (error) {
      handleException(error);
    }
  }
}
