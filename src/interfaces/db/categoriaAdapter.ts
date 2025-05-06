import CategoriasPort from 'core/categorias/categoriaPort';
import { PrismaClient } from '@prisma/client';
import { validarExistente, validarNoExistente } from 'api/utils/validaciones';
import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { RedisService } from 'shared/cache/redis.service';

const prisma = new PrismaClient();

@Injectable()
export default class CategoriasAdapter implements CategoriasPort {
  constructor(private readonly redisService: RedisService) {}

  async crearCategorias(categoriaData: { nombre: string; }) {
    try {

      const nuevaCategoria = await prisma.categoria.create({
        data: {
          nombre_categoria: categoriaData.nombre
        }
      });

      await this.redisService.delete('categorias:lista');

      return nuevaCategoria;
    } catch (error: any) {
      const validacion = validarExistente(error.code, categoriaData.nombre);
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
        data: error.data || "Ocurrió un error consultando el categoria"
      };
    }
  }

  async obtenerCategorias() {
    try {
      const cacheKey = 'categorias:lista';
      const categoriasCache = await this.redisService.get(cacheKey);

      if (categoriasCache) return JSON.parse(categoriasCache);

      const categorias = await prisma.categoria.findMany({
        select: {
          id: true,
          nombre_categoria: true
        }
      });

      if (!categorias.length) throw new ForbiddenException("No se ha encontrado ninguna categoria");
      
      await this.redisService.set(cacheKey, JSON.stringify(categorias));
      return categorias;

    } catch (error: any) {
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error consultando el categoria"
      };
    }
  }

  async obtenerCategoriasXid(categoriaData: { id: string | number }) {
    try {
      const cacheKey = `categoria:${categoriaData.id}`;
      const categoriaCache = await this.redisService.get(cacheKey);

      if (categoriaCache) return JSON.parse(categoriaCache);

      const categoria = await prisma.categoria.findUnique({
        where: { id: Number(categoriaData.id) },
        select: {
          id: true,
          nombre_categoria: true
        }
      });
      if (!categoria) throw new ForbiddenException("La categoría solicitada no existe en la base de datos");
      const categoria_id = {
        id: categoria.id,
        nombre_categoria: categoria.nombre_categoria
      }

      await this.redisService.set(cacheKey, JSON.stringify(categoria_id));
      return categoria_id;
      
    } catch (error: any) {
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error consultando el categoria",
      };
    }
  }

  async delCategoria(categoriaData: { id: string }) {
    try {
      const id = Number(categoriaData.id);
  
      // Eliminar de la base de datos primero
      const categoria = await prisma.categoria.delete({
        where: { id },
      });
  
      // Borrar caché específica por ID
      await this.redisService.delete(`categoria:${id}`);
  
      // Actualizar la lista cacheada
      const categoriasCache = await this.redisService.get('categorias:lista');
      if (categoriasCache) {
        const categorias = JSON.parse(categoriasCache).filter((e: any) => e.id !== id);
        await this.redisService.set('categorias:lista', JSON.stringify(categorias), 3600); // TTL de 1 hora
      }
  
      return {
        ok: true,
        message: "Categoría eliminada correctamente",
        categoria: categoria.id,
      };
  
    } catch (error: any) {
      validarNoExistente(error.code, "La categoría solicitada");
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || "Ocurrió un error eliminando la categoría",
      };
    }
  }

  async actualizaCategoria(categoriaData: {
    nombre?: string;
    id: number | string;
  }) {
    try {
      const { id, nombre } = categoriaData;
  
      // Verificar si la categoría existe
      const categoriaExistente = await prisma.categoria.findUnique({
        where: { id: Number(id) }
      });
  
      if (!categoriaExistente) {
        throw {
          ok: false,
          status_cod: 400,
          message: "La categoría solicitada no existe en la base de datos",
        };
      }
  
      // Preparar los nuevos datos
      const updates = {} as any;
      if (nombre !== undefined) updates.nombre_categoria = nombre;
  
      // Actualizar en base de datos
      const categoriaActualizado = await prisma.categoria.update({
        where: { id: Number(id) },
        data: updates
      });
  
      // Borrar caché individual
      await this.redisService.delete(`categoria:${id}`);
  
      // Actualizar caché de lista si existe
      const categoriasCache = await this.redisService.get('categorias:lista');
      if (categoriasCache) {
        let categorias = JSON.parse(categoriasCache);
        categorias = categorias.map((e: any) =>
          e.id === Number(id)
            ? {
                ...e,
                nombre_categoria: categoriaActualizado.nombre_categoria,
              }
            : e
        );
        await this.redisService.set('categorias:lista', JSON.stringify(categorias), 3600); // TTL 1 hora
      }
  
      return {
        ok: true,
        message: "Categoría actualizada correctamente",
        categoria: categoriaActualizado
      };
    } catch (error: any) {
      validarExistente(error.code, "La categoría solicitada");
      throw {
        ok: false,
        status_cod: 400,
        data: error.message || error.data || "Ocurrió un error actualizando la categoría",
      };
    }
  }
  
}

