import {
  Controller, Post, Body, HttpException, HttpStatus, HttpCode,
  UsePipes, ValidationPipe, Get, Put, Delete, UseGuards, Req
} from '@nestjs/common';
import { PedidoService } from '../../../core/pedidos/pedidoService';
import { ResponseBody } from '../models/ResponseBody';
import { CrearPedidoDto } from './dtos/crearPedido.dto';
import { ObtenerPedidosDto } from './dtos/obtenerPedido.dto';
import { ActualizarPedidoDto } from './dtos/actualizarPedido.dto';
import { EliminarPedidoDto } from './dtos/eliminarPedido.dto';
import { ListarPedidosUsuarioDto } from './dtos/listarPedidosUsuario.dto';
import { AuthGuard } from '../../../core/auth/guards/auth.guard';
import { PermissionsGuard } from '../../../core/auth/guards/permissions.guard';
import { Permissions } from '../../../core/auth/decorators/permissions.decorator';

@Controller('pedidos')
@UseGuards(AuthGuard) 
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionsGuard)
  @Permissions('Escritura')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true, exceptionFactory: (errors) => {
    const mensajes = errors.map(err => ({
      campo: err.property,
      mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
    }));
    return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
  }}))
  async crearPedido(@Body() body: CrearPedidoDto, @Req() request: any): Promise<ResponseBody<string>> {
    try {
      const user = request.user;

      if (!user || !user.userInfo || !user.userInfo.id_user) {
        throw new HttpException('Usuario no autenticado', HttpStatus.UNAUTHORIZED);
      }

      await this.pedidoService.crearPedido({ ...body, id: user.userInfo.id_user });

      return new ResponseBody<string>(true, 201, "Se ha creado el pedido exitosamente");
    } catch (error) {
      this.handleException(error);
    }
  }

  @Get('xUser')
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionsGuard)
  @Permissions('Lectura')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true, exceptionFactory: (errors) => {
    const mensajes = errors.map(err => ({
      campo: err.property,
      mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
    }));
    return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
  }}))
  async obtenerPedidosxUser(@Body() body: ListarPedidosUsuarioDto, @Req() request: any): Promise<ResponseBody<any>> {
    const user = request.user;

      if (!user || !user.userInfo || !user.userInfo.id_user) throw new HttpException('Usuario no autenticado', HttpStatus.UNAUTHORIZED);

    if (!body.id) body.id = user.userInfo.id_user
    try {
      const pedidosXuser = await this.pedidoService.obtenerPedidoXusuario({ id: body.id })

      return new ResponseBody<any>(true, 200, pedidosXuser);
    } catch (error) {
      this.handleException(error);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionsGuard)
  @Permissions('Lectura')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true, exceptionFactory: (errors) => {
    const mensajes = errors.map(err => ({
      campo: err.property,
      mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
    }));
    return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
  }}))
  async obtenerPedidos(@Body() body: ObtenerPedidosDto): Promise<ResponseBody<any>> {
    try {
      const pedidos = body.id_pedido
        ? await this.pedidoService.obtenerPedidoXid({ id_pedido: body.id_pedido })
        : await this.pedidoService.obtenerPedidos();

      return new ResponseBody<any>(true, 200, pedidos);
    } catch (error) {
      this.handleException(error);
    }
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionsGuard)
  @Permissions('Actualizacion')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true, exceptionFactory: (errors) => {
    const mensajes = errors.map(err => ({
      campo: err.property,
      mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
    }));
    return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
  }}))
  async actualizarPedido(@Body() body: ActualizarPedidoDto): Promise<ResponseBody<string>> {
    if (!body.descripcion && !body.fecha && !body.id_usuario && !body.id_estado) {
      throw new HttpException(
        new ResponseBody(false, HttpStatus.BAD_REQUEST, "Debe proporcionar al menos un campo para actualizar."),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!body.id_pedido) {
      throw new HttpException(
        new ResponseBody(false, HttpStatus.BAD_REQUEST, "Debe proporcionar un id para actualizar."),
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      await this.pedidoService.upPedido({ id_pedido: body.id_pedido, ...body });
      return new ResponseBody(true, HttpStatus.OK, "Pedido actualizado exitosamente.");
    } catch (error) {
      this.handleException(error);
    }
  }

  @Delete()
  @UseGuards(PermissionsGuard)
  @Permissions('Elimina')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true, exceptionFactory: (errors) => {
    const mensajes = errors.map(err => ({
      campo: err.property,
      mensaje: err.constraints ? Object.values(err.constraints).join(', ') : ''
    }));
    return new HttpException(new ResponseBody(false, HttpStatus.BAD_REQUEST, mensajes), HttpStatus.BAD_REQUEST);
  }}))

  async delPedido(@Body() eliminarPedidoDto: EliminarPedidoDto): Promise<ResponseBody<string>> {
    try {
      await this.pedidoService.delPedido({ id_pedido: eliminarPedidoDto.id_pedido });
      return new ResponseBody(true, 201, "Se ha eliminado el pedido exitosamente");
    } catch (error) {
      this.handleException(error);
    }
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
