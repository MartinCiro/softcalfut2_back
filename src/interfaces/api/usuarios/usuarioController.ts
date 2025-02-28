import { 
  Controller, Post, Body, HttpException, HttpStatus, HttpCode, 
  UsePipes, ValidationPipe, Get, Put, Delete, UseGuards, Req 
} from '@nestjs/common';
import { UsuarioService } from '../../../core/usuarios/usuarioService';
import { ResponseBody } from '../models/ResponseBody';
import { CrearUsuarioDto } from './dtos/crearUsuario.dto';
import { ObtenerUsuariosDto } from './dtos/obtenerUsuario.dto';
import { ActualizarUsuarioDto } from './dtos/actualizarUsuario.dto';
import { EliminarUsuarioDto } from './dtos/eliminarUsuario.dto';
import { AuthGuard } from '../../../core/auth/guards/auth.guard';
import { PermissionsGuard } from '../../../core/auth/guards/permissions.guard';
import { Permissions } from '../../../core/auth/decorators/permissions.decorator';

@Controller('usuarios')
@UseGuards(AuthGuard) // Todas las rutas requieren autenticación
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionsGuard)
  @Permissions('Escritura')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async crearUsuario(@Body() body: CrearUsuarioDto): Promise<ResponseBody<string>> {
    try {
      await this.usuarioService.crearUsuario(body);
      return new ResponseBody<string>(true, 201, "Se ha creado el usuario exitosamente");
    } catch (error) {
      this.handleException(error);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionsGuard)
  @Permissions('Lectura')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async obtenerUsuarios(@Body() body: ObtenerUsuariosDto): Promise<ResponseBody<any>> {
    try {
      const usuarios = body.email
        ? await this.usuarioService.obtenerUsuarioXid({ email: body.email })
        : await this.usuarioService.obtenerUsuarios();

      return new ResponseBody<any>(true, 200, usuarios);
    } catch (error) {
      this.handleException(error);
    }
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionsGuard)
  @Permissions('Actualizacion')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async actualizarUsuario(@Body() body: ActualizarUsuarioDto): Promise<ResponseBody<string>> {
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
      this.handleException(error);
    }
  }

  @Delete()
  @UseGuards(PermissionsGuard)
  @Permissions('Elimina')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))

  async delUsuario(@Body() eliminarUsuarioDto: EliminarUsuarioDto): Promise<ResponseBody<string>> {
    try {
      await this.usuarioService.delUsuario({ email: eliminarUsuarioDto.email });
      return new ResponseBody(true, 201, "Se ha eliminado el usuario exitosamente");
    } catch (error) {
      this.handleException(error);
    }
  }

  /**
   * ✅ Métodos protegidos con roles específicos
   */

  @Get('perfil')
  async getPerfil(@Req() request: any) {
    return new ResponseBody(true, 200, { mensaje: 'Usuario autenticado', usuario: request.user });
  }

  /**
   * 📌 Manejo centralizado de errores
   */
  private handleException(error: any): never {
    if (typeof error === 'object' && error !== null && 'status_cod' in error && 'data' in error) {
      const statusCode = typeof error.status_cod === 'number' ? error.status_cod : HttpStatus.INTERNAL_SERVER_ERROR;
      const data = typeof error.data === 'string' ? error.data : 'Error desconocido';
      throw new HttpException(new ResponseBody(false, statusCode, data), statusCode);
    }
    throw new HttpException(new ResponseBody(false, HttpStatus.INTERNAL_SERVER_ERROR, 'Error interno del servidor'), HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
