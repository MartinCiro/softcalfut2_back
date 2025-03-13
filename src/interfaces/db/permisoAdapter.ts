import PermisosPort from 'core/permisos/permisoPort';
import { PrismaClient } from '@prisma/client';
import { validarExistente, validarNoExistente } from 'api/utils/validaciones';
import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';

const prisma = new PrismaClient();

@Injectable()
export default class PermisosAdapter implements PermisosPort {

  async crearPermisos(permisoData: { nombre: string; descripcion?: string; }) {
    try {
      const nuevoPermiso = await prisma.permiso.create({
        data: {
          nombre: permisoData.nombre,
          descripcion: permisoData.descripcion
        }
      });

      return nuevoPermiso;
    } catch (error: any) {
      const validacion = validarExistente(error.code, permisoData.nombre);
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
        data: error.data || "Ocurrió un error consultando el permiso"
      };
    }
  }

  async obtenerPermisos() {
    try {
      const permisos = await prisma.permiso.findMany({
        select: {
          id: true,
          nombre: true,
          descripcion: true,
        }
      });
      if (!permisos.length) throw new ForbiddenException("No se encontró el permiso");


      return permisos.map((permiso: { id: any; nombre: any; descripcion: any; }) => ({
        id: permiso.id,
        nombre: permiso.nombre,
        descripcion: permiso.descripcion
      }));
    } catch (error: any) {
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error consultando el permiso"
      };
    }
  }

  async obtenerPermisosXid(permisoData: { id: string | number; }) {
    try {
      const permiso = await prisma.permiso.findUnique({
        where: { id: Number(permisoData.id) },
        select: {
          id: true,
          nombre: true,
          descripcion: true,
        }
      });

      if (!permiso) throw new ForbiddenException("No se encontró el permiso");

      return {
        id: permiso.id,
        nombre: permiso.nombre,
        descripcion: permiso.descripcion
      };
    } catch (error: any) {
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error consultando el permiso",
      };
    }
  }

  async delPermiso(permisoData: { id: string }) {
    try {
      const permiso = await prisma.permiso.delete({
        where: { id: Number(permisoData.id) },
      });

      return {
        ok: true,
        message: "Permiso eliminado correctamente",
        permiso: permiso.id,
      };
    } catch (error: any) {
      validarNoExistente(error.code, "El permiso solicitado");
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error eliminando el permiso",
      };
    }
  }


  async actualizaPermiso(permisoData: {  nombre?: string; descripcion?: string; id: number | string; }) {
    try {
      const { id, ...updates } = permisoData;
  
      const permisoActualizado = await prisma.permiso.update({
        where: { id: Number(id) }, 
        data: {
          ...updates,
        },
      });
  
      return {
        ok: true,
        message: "Permiso actualizado correctamente",
        permiso: permisoActualizado,
      };
    } catch (error: any) {
      validarExistente(error.code, "El permiso solicitado");
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error actualizando el permiso",
      };
    }
  }
  
}

