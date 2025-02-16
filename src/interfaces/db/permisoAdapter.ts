
import { Pool } from 'pg';
import PermisosPort from '../../core/permisos/permisoPort';
import getConnection from '../DBConn';
import { validarExistente } from '../api/utils/validaciones';  


class PermisosAdapter implements PermisosPort {
  private pool: Pool;

  constructor() {
    this.pool = getConnection(); 
  }

  // Implementación del método para crear un permiso
  async crearPermisos(permisoData: { nombre: string; descripcion: string; estado: number | string; }) {
    const client = await this.pool.connect();
    return client
    .query(`INSERT INTO permiso (nombre, descripcion, estado) VALUES ($1, $2, $3)`, [permisoData.nombre, permisoData.descripcion, permisoData.estado])
    .then((data) => {
      if (data && data.rowCount && data.rowCount > 0) return { ok: true, status_cod: 200, data: "Creado con exito" };
    })
    .catch((error) => {
      const validacion = validarExistente(error.code, permisoData.nombre);
      if (!validacion.ok) {
        throw {
          ok: validacion.ok,
          status_cod: 409,
          data: validacion.data,
        };
      }
      throw {
        ok: false,
        status_cod: 400,
        data: "Ocurrió un error consultando el permiso",
      };
    })
    .finally(() => client.release());
  }
  
  async obtenerPermisos() {
    const client = await this.pool.connect();
    return client
    .query(
      `SELECT 
          p.id,
          p.nombre,
          p.descripcion,
          e.nombre AS estado
      FROM permiso p
      JOIN estado e ON p.estado = e.id
    `)
    .then((data) => {
      if (data && data.rowCount && data.rowCount > 0) return data.rows;
      throw {
        data: "No se encontraron datos",
      };
    })
    .catch((error) => {
      throw {
        ok: false,
        status_cod: error.status_cod || 400,
        data: error.data || "Ocurrió un error consultando el permiso",
      };
    })
    .finally(() => client.release());
  }

  async obtenerPermisosXid(permisoDataXid: { id_permiso: string | number; }) {
    const client = await this.pool.connect();
    return client
    .query(`
      SELECT 
          p.id,
          p.nombre,
          p.descripcion,
          e.nombre AS estado
      FROM permiso p
      JOIN estado e ON p.estado = e.id where p.id = $1
      `, [permisoDataXid.id_permiso])
    .then((data) => {
      if (data && data.rowCount && data.rowCount > 0) return data.rows[0];
      throw {
        ok: false,
        status_cod: 409,
        data: "El permiso solicitado no existe en bd",
      };
    })
    .catch((error) => {
      throw {
        ok: false,
        status_cod: error.status_cod || 400,
        data: error.data || "Ocurrió un error consultando el permiso",
      };
    })
    .finally(() => client.release());
  }

  async delPermiso(permisoDataXid: { id_permiso: string | number; }) {
    const client = await this.pool.connect();
    return client
    .query(`DELETE FROM permiso where id = $1`, [permisoDataXid.id_permiso])
    .then((data) => {
      if (data && data.rowCount && data.rowCount > 0) return data.rows[0];
      throw {
        ok: false,
        status_cod: 409,
        data: "El permiso solicitado no existe en bd",
      };
    })
    .catch((error) => {
      throw {
        ok: false,
        status_cod: error.status_cod || 400,
        data: error.data || "Ocurrió un error consultando el permiso",
      };
    })
    .finally(() => client.release());
  }

  
  async actualizaPermiso(permisoDataXid: { id_permiso: string | number; nombre?: string; descripcion?: string; estado?: string | number;}) {
    const { id_permiso } = permisoDataXid;
    const client = await this.pool.connect();

    // Definir las columnas posibles y sus valores
    const columnas: Record<string, any> = {
      nombre: permisoDataXid.nombre,
      descripcion: permisoDataXid.descripcion,
      estado: permisoDataXid.estado
    };
  
    const columnasFiltradas = Object.entries(columnas).filter(([key, value]) => value !== undefined);
  
    const actualizacionesSQL = columnasFiltradas.map(([key], index) => `${key} = $${index + 1}`).join(', ');
    const valores = columnasFiltradas.map(([_, value]) => value);
  
    // Añadir el ID al final de los parámetros
    valores.push(id_permiso);
  
    const consulta = `
      UPDATE permiso
      SET ${actualizacionesSQL}
      WHERE id = $${valores.length}
    `;
  
    return client
      .query(consulta, valores)
      .then((data) => {
        if (data && data.rowCount && data.rowCount > 0) return data.rows[0];
        throw {
          ok: false,
          status_cod: 409,
          data: "El permiso solicitado no existe en bd",
        };
      })
      .catch((error) => {
        throw {
          ok: false,
          status_cod: error.status_cod || 400,
          data: error.data || "Ocurrió un error consultando el permiso",
        };
      })
      .finally(() => client.release());
  }
  
}

export default PermisosAdapter;
