import { Controller, Post, Body, HttpException, HttpStatus, HttpCode, UsePipes, ValidationPipe, Get, Put, Delete } from '@nestjs/common';
import { UsuarioService } from '../../../core/usuarios/usuarioService';
import { ResponseBody } from '../models/ResponseBody';
import { CrearUsuarioDto } from './dtos/crearUsuario.dto';
import { ObtenerUsuariosDto } from './dtos/obtenerUsuario.dto';
import { ActualizarUsuarioDto } from './dtos/actualizarUsuario.dto';
import { EliminarUsuarioDto } from './dtos/eliminarUsuario.dto';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true })) // Aplica validaciones automáticas
  async crearUsuario(@Body() body: CrearUsuarioDto): Promise<ResponseBody<string>> {
    try {
      await this.usuarioService.crearUsuario(body);
      return new ResponseBody<string>(true, 201, "Se ha creado el usuario exitosamente");
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'status_cod' in error && 'data' in error) {
        const err = error as { status_cod: unknown; data: unknown };
        const statusCode = typeof err.status_cod === 'number' ? err.status_cod : HttpStatus.INTERNAL_SERVER_ERROR;
        const data = typeof err.data === 'string' ? err.data : 'Error desconocido';

        throw new HttpException(new ResponseBody(false, statusCode, data), statusCode);
      }

      throw new HttpException(new ResponseBody(false, HttpStatus.INTERNAL_SERVER_ERROR, 'Error interno del servidor'), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))

  async obtenerUsuarios(@Body() body: ObtenerUsuariosDto): Promise<ResponseBody<any>> {
    try {
      const { email } = body;

      // Si no se pasa el email, obtenemos todos los usuarios
      const usuarios = email
        ? await this.usuarioService.obtenerUsuarioXid({ email })
        : await this.usuarioService.obtenerUsuarios();

      return new ResponseBody<any>(true, 200, usuarios);
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'status_cod' in error && 'data' in error) {
        const err = error as { status_cod: unknown; data: unknown };
        const statusCode = typeof err.status_cod === 'number' ? err.status_cod : HttpStatus.INTERNAL_SERVER_ERROR;
        const data = typeof err.data === 'string' ? err.data : 'Error desconocido';

        throw new HttpException(new ResponseBody(false, statusCode, data), statusCode);
      }

      throw new HttpException(new ResponseBody(false, HttpStatus.INTERNAL_SERVER_ERROR, 'Error interno del servidor'), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true })) // Aplica validaciones automáticas
  async actualizarUsuario(@Body() body: ActualizarUsuarioDto): Promise<ResponseBody<string>> {
    // Validación de campos
    if (!body.email && !body.nombres && !body.pass && !body.estado && !body.id_rol) {
      throw new HttpException(
        new ResponseBody(false, HttpStatus.BAD_REQUEST, "Debe proporcionar al menos un campo para actualizar."),
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      await this.usuarioService.upUsuario(body);
      return new ResponseBody(true, HttpStatus.OK, "Usuario actualizado exitosamente.");
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'status_cod' in error && 'data' in error) {
        const err = error as { status_cod: unknown; data: unknown };
        const statusCode = typeof err.status_cod === 'number' ? err.status_cod : HttpStatus.INTERNAL_SERVER_ERROR;
        const data = typeof err.data === 'string' ? err.data : 'Error desconocido';

        throw new HttpException(new ResponseBody(false, statusCode, data), statusCode);
      }

      throw new HttpException(new ResponseBody(false, HttpStatus.INTERNAL_SERVER_ERROR, 'Error interno del servidor'), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true })) 
  async delUsuario(@Body() eliminarUsuarioDto: EliminarUsuarioDto): Promise<ResponseBody<string>> {
    const { email } = eliminarUsuarioDto;

    try {
      // Llama al servicio para eliminar el usuario
      await this.usuarioService.delUsuario({ email });
      return new ResponseBody(true, 201, "Se ha eliminado el usuario exitosamente");
    } catch (error) {
      if (typeof error === "object" && error !== null && "status_cod" in error) {
        const err = error as { ok: boolean; status_cod: number; data: any };
        throw new HttpException(new ResponseBody(err.ok, err.status_cod, err.data), err.status_cod);
      } else {
        throw new HttpException(new ResponseBody(false, 500, "Error interno del servidor"), HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}