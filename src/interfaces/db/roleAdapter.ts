// src/interfaces/db/roleAdapter.ts
import { Pool } from 'pg';
import RolePort from '../../core/roles/rolePort';
import getConnection from '../DBConn';
import { validarExistente, validarNoExistente } from '../api/utils/validaciones';

class RoleAdapter implements RolePort {
  private pool: Pool;

  constructor() {
    this.pool = getConnection();
  }

  // Implementación del método para crear un rol
  async crearRol(rolData: { nombre: string; descripcion: string; estado: number; }) {
    const client = await this.pool.connect();
    return client
      .query(`INSERT INTO rol (nombre, descripcion, estado) VALUES ($1, $2, $3) RETURNING id`, [rolData.nombre, rolData.descripcion, rolData.estado])
      .then((data) => {
        if (data && data.rowCount && data.rowCount > 0) return data.rows[0];
      })
      .catch((error) => {

        const validacion = validarExistente(error.code, rolData.nombre);
        const valNoExistente = validarNoExistente(error.code, "El estado asignado");
        if (!validacion.ok || !valNoExistente.ok) {
          throw {
            ok: false,
            status_cod: 409,
            data: valNoExistente.data || validacion.data,
          };
        }
        throw {
          ok: false,
          status_cod: 400,
          data: "Ocurrió un error consultando el rol",
        };
      })
      .finally(() => client.release());
  }

  async obtenerRol() {
    const client = await this.pool.connect();
    return client
      .query(`SELECT r.id,r.nombre, r.descripcion, e.nombre AS estado FROM rol r JOIN estado e ON r.estado = e.id`)
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
          data: error.data || "Ocurrió un error consultando el rol",
        };
      })
      .finally(() => client.release());
  }

  async obtenerRolXid(rolDataXid: { id_rol: string | number; }) {
    const client = await this.pool.connect();
    return client
      .query(`SELECT r.id,r.nombre, r.descripcion, e.nombre AS estado FROM rol r JOIN estado e ON r.estado = e.id where r.id = $1`, [rolDataXid.id_rol])
      .then((data) => {
        if (data && data.rowCount && data.rowCount > 0) return data.rows[0];
        throw {
          ok: false,
          status_cod: 409,
          data: "El rol solicitado no existe en bd",
        };
      })
      .catch((error) => {
        throw {
          ok: false,
          status_cod: error.status_cod || 400,
          data: error.data || "Ocurrió un error consultando el rol",
        };
      })
      .finally(() => client.release());
  }

  async delRol(rolDataXid: { id_rol: string | number; }) {
    const client = await this.pool.connect();
    return client
      .query(`DELETE FROM rol where id = $1`, [rolDataXid.id_rol])
      .then((data) => {
        if (data && data.rowCount && data.rowCount > 0) return data.rows[0];
        throw {
          ok: false,
          status_cod: 409,
          data: "El rol solicitado no existe en bd",
        };
      })
      .catch((error) => {
        throw {
          ok: false,
          status_cod: error.status_cod || 400,
          data: error.data || "Ocurrió un error consultando el rol",
        };
      })
      .finally(() => client.release());
  }


  async actualizaRol(rolDataXid: { id_rol: string | number; nombre?: string; descripcion?: string; estado?: number; }) {
    const { id_rol } = rolDataXid;
    const client = await this.pool.connect();

    // Definir las columnas posibles y sus valores
    const columnas: Record<string, any> = {
      nombre: rolDataXid.nombre,
      descripcion: rolDataXid.descripcion,
      estado: rolDataXid.estado
    };

    const columnasFiltradas = Object.entries(columnas).filter(([key, value]) => value !== undefined);

    const actualizacionesSQL = columnasFiltradas.map(([key], index) => `${key} = $${index + 1}`).join(', ');
    const valores = columnasFiltradas.map(([_, value]) => value);

    // Añadir el ID al final de los parámetros
    valores.push(id_rol);

    const consulta = `
        UPDATE rol
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
          data: "El rol solicitado no existe en bd",
        };
      })
      .catch((error) => {
        if (error.code) throw validarNoExistente(error.code, "El estado asignado");
        throw {
          ok: false,
          status_cod: error.status_cod || 400,
          data: error.data || "Ocurrió un error consultando el rol",
        };
      })
      .finally(() => client.release());
  }

}

export default RoleAdapter;
