import { PrismaClient } from '@prisma/client';
import EstadosPort from '../../core/estados/estadoPort';
import { validarExistente } from '../api/utils/validaciones';

const prisma = new PrismaClient();

class EstadosAdapter implements EstadosPort {

  // Implementación del método para crear un estado
  async crearEstados(estadoData: { nombre: string; descripcion: string }) {
    try {
      const estado = await prisma.estado.create({
        data: {
          nombre: estadoData.nombre,
          descripcion: estadoData.descripcion
        },
        select: {
          id: true
        }
      });

      return estado;
    } catch (error: any) {
      const validacion = validarExistente(error.code, estadoData.nombre);
      if (!validacion.ok) {
        throw {
          ok: validacion.ok,
          status_cod: 409,
          data: validacion.data
        };
      }
      throw {
        ok: false,
        status_cod: 400,
        data: "Ocurrió un error creando el estado"
      };
    }
  }

  
  async obtenerEstados() {
    try {
      const estados = await prisma.estado.findMany();
  
      if (estados.length === 0) {
        return { ok: false, status_cod: 404, data: "No se encontraron datos" };
      }
  
      return estados;
    } catch (error: any) {
      throw {
        ok: false,
        status_cod: error.status_cod || 400,
        data: error.data || "Ocurrió un error consultando el estado",
      };
    }
  }
  

  async obtenerEstadosXid(estadoDataXid: { id_estado: string | number }) {
    try {
      const estado = await prisma.estado.findUnique({
        where: { id: Number(estadoDataXid.id_estado) },
      });
  
      if (!estado) {
        throw {
          ok: false,
          status_cod: 404,
          data: "El estado solicitado no existe en la base de datos",
        };
      }
  
      return estado;
    } catch (error: any) {
      throw {
        ok: false,
        status_cod: error.status_cod || 400,
        data: error.data || "Ocurrió un error consultando el estado",
      };
    }
  }
  

  async delEstado(estadoDataXid: { id_estado: string | number }) {
    try {
      const estado = await prisma.estado.delete({
        where: { id: Number(estadoDataXid.id_estado) },
      });
  
      return {
        ok: true,
        status_cod: 200,
        data: "Estado eliminado correctamente",
      };
    } catch (error: any) {
      if (error.code === "P2025") {
        throw {
          ok: false,
          status_cod: 404,
          data: "El estado solicitado no existe en la base de datos",
        };
      }
  
      throw {
        ok: false,
        status_cod: 400,
        data: "Ocurrió un error eliminando el estado",
      };
    }
  }
  

  
  async actualizaEstado(estadoDataXid: { id_estado: string | number; nombre?: string; descripcion?: string }) {
    try {
      const { id_estado, nombre, descripcion } = estadoDataXid;
  
      // Filtramos solo los campos que tienen valor
      const dataToUpdate: Record<string, any> = {};
      if (nombre !== undefined) dataToUpdate.nombre = nombre;
      if (descripcion !== undefined) dataToUpdate.descripcion = descripcion;
  
      const estadoActualizado = await prisma.estado.update({
        where: { id: Number(id_estado) },
        data: dataToUpdate,
      });
  
      return {
        ok: true,
        status_cod: 200,
        data: estadoActualizado,
      };
    } catch (error: any) {
      if (error.code === "P2025") {
        throw {
          ok: false,
          status_cod: 404,
          data: "El estado solicitado no existe en la base de datos",
        };
      }
  
      throw {
        ok: false,
        status_cod: 400,
        data: "Ocurrió un error actualizando el estado",
      };
    }
  }
  
  
}

export default EstadosAdapter;
