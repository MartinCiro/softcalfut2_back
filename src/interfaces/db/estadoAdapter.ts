import EstadosPort from 'core/estados/estadoPort';
import { PrismaClient } from '@prisma/client';
import { validarExistente, validarNoExistente } from 'api/utils/validaciones';
import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { ResponseBody } from '../api/models/ResponseBody';

const prisma = new PrismaClient();

@Injectable()
export default class EstadosAdapter implements EstadosPort {

  async crearEstados(estadoData: { nombre: string; descripcion?: string; }) {
    try {

      const nuevoEstado = await prisma.estado.create({
        data: {
          nombre: estadoData.nombre,
          descripcion: estadoData.descripcion
        }
      });


      return nuevoEstado;
    } catch (error: any) {
      const validacion = validarExistente(error.code, estadoData.nombre);
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
        data: error.data || "Ocurrió un error consultando el estado"
      };
    }
  }

  async obtenerEstados() {
    try {
      const estados = await prisma.estado.findMany({
        select: {
          id: true,
          nombre: true,
          descripcion: true,
        }
      });
      if (!estados.length) throw new ForbiddenException("No se ha encontrado ningun estado");

      return estados.map((estado: { id: any; nombre: any; descripcion: any; }) => ({
        id: estado.id,
        nombre: estado.nombre,
        descripcion: estado.descripcion
      }));

    } catch (error: any) {
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error consultando el estado"
      };
    }
  }

  async obtenerEstadosXid(estadoData: { id: string | number }) {
    try {
      const estado = await prisma.estado.findUnique({
        where: { id: Number(estadoData.id) },
        select: {
          id: true,
          nombre: true,
          descripcion: true,
        }
      });

      if (!estado) throw new ForbiddenException("El estado solicitado no existe en la base de datos");
      return {
        id: estado.id,
        nombre: estado.nombre,
        descripcion: estado.descripcion
      };
      
    } catch (error: any) {
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error consultando el estado",
      };
    }
  }

  async delEstado(estadoData: { id: string }) {
    try {
      const estado = await prisma.estado.delete({
        where: { id: Number(estadoData.id) },
      });

      return {
        ok: true,
        message: "Estado eliminado correctamente",
        estado: estado.id,
      };
    } catch (error: any) {
      validarNoExistente(error.code, "El estado solicitado");
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error eliminando el estado",
      };
    }
  }
  async actualizaEstado(estadoData: {
    nombre?: string;
    descripcion?: string;
    id: number | string;
  }) {
    try {
      const { id, ...updates } = estadoData;

      // Verificar si el estado existe
      const estadoExistente = await prisma.estado.findUnique({
        where: { id: Number(id) }
      });

      if (!estadoExistente) {
        throw {
          ok: false,
          status_cod: 400,
          message: "El estado solicitado no existe en la base de datos",
        }
      }


      // Actualizar el estado con los nuevos datos
      const estadoActualizado = await prisma.estado.update({
        where: { id: Number(id) },
        data: updates
      });

      return {
        ok: true,
        message: "Estado actualizado correctamente",
        estado: estadoActualizado
      };
    } catch (error: any) {
      validarExistente(error.code, "El estado solicitado");
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || error.data || "Ocurrió un error actualizando el estado",
      };
    }
  }


}

