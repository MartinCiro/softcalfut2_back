import PedidosPort from '../../core/pedidos/pedidoPort';
import { PrismaClient } from '@prisma/client';
import { validarExistente, validarNoExistente } from '../api/utils/validaciones';
import { Injectable } from '@nestjs/common';

const prisma = new PrismaClient();

@Injectable()
export default class PedidosAdapter implements PedidosPort {

  async crearPedidos(pedidoData: {
    descripcion: string;
    fecha: Date;
    id: string;
    estado?: number | string;
  }) {
    try {
      const estado = await prisma.estado.findUnique({
        where: { nombre: 'pendiente' },
        select: { id: true }
      });

      if (!estado) {
        throw {
          ok: false,
          status_cod: 409,
          data: "No se encontró el estado"
        };
      }

      const usuario = await prisma.usuario.findUnique({
        where: { id: pedidoData.id },
        select: { id: true }
      });


      if (!usuario) {
        throw {
          ok: false,
          status_cod: 409,
          data: "No se encontró el usuario"
        };
      }

      const nuevoPedido = await prisma.pedido.create({
        data: {
          descripcion: pedidoData.descripcion,
          fecha: pedidoData.fecha,
          id_estado: estado.id,
          id_usuario: usuario.id
        },
        select: { id: true, descripcion: true, fecha: true, id_usuario: true }
      });

      return nuevoPedido;
    } catch (error: any) {
      const validacion = validarExistente(error.code, pedidoData.id);
      if (!validacion.ok) {
        throw {
          ok: false,
          status_cod: 409,
          data: validacion.data
        };
      }

      const resultado = error.meta?.target?.[0] || "valor";
      const valNoExistente = validarNoExistente(error.code, `El ${resultado} asignado`);

      if (!valNoExistente.ok) {
        throw {
          ok: false,
          status_cod: 409,
          data: valNoExistente.data
        };
      }

      throw {
        ok: false,
        status_cod: 400,
        data: "Ocurrió un error consultando el pedido"
      };
    }
  }

  async obtenerPedidos() {
    try {
      const pedidos = await prisma.pedido.findMany({
        select: {
          id: true,
          descripcion: true,
          fecha: true,
          usuario: {
            select: {
              id: true,
              nombre: true
            }
          },
          estado: {
            select: { nombre: true }
          }
        }
      });

      if (!pedidos.length) {
        throw {
          ok: false,
          status_cod: 404,
          data: "No se encontraron pedidos"
        };
      }

      return pedidos.map(pedido => ({
        id_pedido: pedido.id,
        descripcion: pedido.descripcion,
        fecha: pedido.fecha,
        id: pedido.usuario.id,
        nombre_usuario: pedido.usuario.nombre,
        estado_pedido: pedido.estado.nombre
      }));

    } catch (error: any) {
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error consultando los pedidos"
      };
    }
  }


  async obtenerPedidosXid(pedidoData: { id_pedido: string | number; }) {
    try {
      const pedido = await prisma.pedido.findUnique({
        where: { id: Number(pedidoData.id_pedido) },
        select: {
          id: true,
          descripcion: true,
          fecha: true,
          usuario: {
            select: {
              id: true,
              nombre: true
            }
          },
          estado: {
            select: { nombre: true }
          }
        }
      });

      if (!pedido) {
        throw {
          ok: false,
          status_cod: 404,
          data: "El pedido solicitado no existe en la base de datos",
        };
      }

      return {
        id_pedido: pedido.id,
        descripcion: pedido.descripcion,
        fecha: pedido.fecha,
        id: pedido.usuario.id,
        nombre_usuario: pedido.usuario.nombre,
        estado_pedido: pedido.estado.nombre
      };

    } catch (error: any) {
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error consultando el pedido",
      };
    }
  }


  async delPedido(pedidoData: { id_pedido: string }) {
    try {
      const pedido = await prisma.pedido.delete({
        where: { id: Number(pedidoData.id_pedido) },
        select: { id: true, usuario: { select: { id: true } } }
      });

      return {
        ok: true,
        message: "Pedido eliminado correctamente",
        pedido: {
          id_pedido: pedido.id,
          id_usuario: pedido.usuario.id
        }
      };
    } catch (error: any) {
      if (error.code === "P2025") validarNoExistente(error.code, "El pedido solicitado");
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error eliminando el pedido",
      };
    }
  }

  async actualizaPedido(pedidoData: {
    id_pedido: string | number;
    descripcion?: string;
    fecha?: Date;
    id_estado?: number;
  }) {
    try {
      const { id_pedido, ...updates } = pedidoData;

      const pedidoActualizado = await prisma.pedido.update({
        where: { id: Number(id_pedido) },
        data: updates,
        select: {
          id: true,
          descripcion: true,
          fecha: true,
          estado: { select: { nombre: true } }
        }
      });
      return {
        ok: true,
        message: "Pedido actualizado correctamente",
        pedido: {
          id_pedido: pedidoActualizado.id,
          descripcion: pedidoActualizado.descripcion,
          fecha: pedidoActualizado.fecha,
          estado: pedidoActualizado.estado.nombre
        }
      };
    } catch (error: any) {
      if (error.code === "P2025") validarNoExistente(error.code, "El pedido solicitado");
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error actualizando el pedido",
      };
    }
  }

  async obtenerPedidosXusuario(pedidoData: { id: string | number }): Promise<any> {
    try {
        const id = String(pedidoData.id); 

        const pedidos = await prisma.pedido.findMany({
            where: { usuario: { id } },
            select: {
                id: true,
                descripcion: true,
                fecha: true,
                estado: {
                    select: { nombre: true }
                }
            }
        });

        if (!pedidos.length) {
            throw {
                ok: false,
                status_cod: 404,
                data: "No se encontraron pedidos para este usuario"
            };
        }

        return {
            ok: true,
            message: "Pedidos obtenidos correctamente",
            pedidos: pedidos.map(pedido => ({
                id_pedido: pedido.id,
                descripcion: pedido.descripcion,
                fecha: pedido.fecha,
                estado_pedido: pedido.estado.nombre
            }))
        };
    } catch (error: any) {
        throw {
            ok: false,
            status_cod: 400,
            data: error.message || "Ocurrió un error consultando los pedidos"
        };
    }
}

}
