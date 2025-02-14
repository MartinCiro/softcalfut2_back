// src/interfaces/db/estadoAdapter.ts
import { Pool } from 'pg';
import EstadosPort from '../../core/estados/estadoPort';
import getConnection from '../DBConn';
import { validarExistente } from '../api/utils/validaciones';  


class EstadosAdapter implements EstadosPort {
  private pool: Pool;

  constructor() {
    this.pool = getConnection(); 
  }

  // Implementación del método para crear un estado
  async crearEstados(estadoData: { nombre: string; descripcion: string }) {
    const client = await this.pool.connect();
    return client
    .query(`INSERT INTO estado (nombre, descripcion) VALUES ($1, $2) RETURNING id`, [estadoData.nombre, estadoData.descripcion])
    .then((data) => {
      if (data && data.rowCount && data.rowCount > 0) return data.rows[0];
    })
    .catch((error) => {
      const validacion = validarExistente(error.code, estadoData.nombre);
      if (!validacion.ok) {
        throw {
          ok: validacion.ok,
          status_cod: 409,
          data: validacion.result,
        };
      }
      throw {
        ok: false,
        status_cod: 400,
        data: "Ocurrió un error consultando el estado",
      };
    })
    .finally(() => client.release());
  }
  
  async obtenerEstados() {
    const client = await this.pool.connect();
    return client
    .query(`SELECT * FROM estado`)
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
        data: error.data || "Ocurrió un error consultando el estado",
      };
    })
    .finally(() => client.release());
  }

  async obtenerEstadosXid(EstadoDataXid: { id_estado: string | number; }) {
    const client = await this.pool.connect();
    return client
    .query(`SELECT * FROM estado where id = $1`, [EstadoDataXid.id_estado])
    .then((data) => {
      if (data && data.rowCount && data.rowCount > 0) return data.rows[0];
      throw {
        ok: false,
        status_cod: 409,
        data: "El estado solicitado no existe en bd",
      };
    })
    .catch((error) => {
      throw {
        ok: false,
        status_cod: error.status_cod || 400,
        data: error.data || "Ocurrió un error consultando el estado",
      };
    })
    .finally(() => client.release());
  }

  async delEstado(EstadoDataXid: { id_estado: string | number; }) {
    const client = await this.pool.connect();
    return client
    .query(`DELETE FROM estado where id = $1`, [EstadoDataXid.id_estado])
    .then((data) => {
      if (data && data.rowCount && data.rowCount > 0) return data.rows[0];
      throw {
        ok: false,
        status_cod: 409,
        data: "El estado solicitado no existe en bd",
      };
    })
    .catch((error) => {
      throw {
        ok: false,
        status_cod: error.status_cod || 400,
        data: error.data || "Ocurrió un error consultando el estado",
      };
    })
    .finally(() => client.release());
  }
}

export default EstadosAdapter;
