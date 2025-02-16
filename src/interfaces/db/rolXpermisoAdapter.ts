// src/interfaces/db/rolXpermisoAdapter.ts
import { Pool } from 'pg';
import RolxPermisosPort from '../../core/rolXpermisos/rolXpermisoPort';
import getConnection from '../DBConn';
import { validarExistente } from '../api/utils/validaciones';


class RolxPermisosAdapter implements RolxPermisosPort {
  private pool: Pool;

  constructor() {
    this.pool = getConnection();
  }

  async crearRolxPermisos(rolXpermisoData: { id_rol: string | number; id_permiso: Array<string | number> }) {
    const client = await this.pool.connect();

    try {
      await client.query(
        `DELETE FROM rolXpermiso WHERE id_rol = $1`,
        [rolXpermisoData.id_rol]
      );

      // Crear un array de promesas para cada inserción
      const queries = rolXpermisoData.id_permiso.map((permiso) => {
        return client.query(
          `INSERT INTO rolXpermiso (id_rol, id_permiso) VALUES ($1, $2)`,
          [rolXpermisoData.id_rol, permiso]
        );
      });

      const results = await Promise.all(queries);

      return results.map(result => result.rows[0]);

    } catch (error) {
      console.error("Error en crearRolxPermisos:", error);

      if (typeof error === "object" && error !== null && "code" in error) {
        const validacion = validarExistente((error as any).code, rolXpermisoData.id_rol.toString());

        if (!validacion.ok) {
          throw {
            ok: validacion.ok,
            status_cod: 409,
            data: validacion.data,
          };
        }
      }

      throw {
        ok: false,
        status_cod: 400,
        data: "Ocurrió un error insertando en rolXpermiso",
      };
    } finally {
      client.release();
    }
  }

  async obtenerRolxPermisos() {
    const client = await this.pool.connect();
    return client
      .query(`
      SELECT 
          r.nombre AS nombre_rol,
          STRING_AGG(p.nombre, ', ' ORDER BY p.nombre) AS permisos
      FROM rol r
      JOIN rolxpermiso rp ON r.id = rp.id_rol
      JOIN permiso p ON rp.id_permiso = p.id
      GROUP BY r.nombre
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
          data: error.data || "Ocurrió un error consultando el rolXpermiso",
        };
      })
      .finally(() => client.release());
  }

  async obtenerRolxPermisosXid(rolXpermisoDataXid: { id_rol: string | number; }) {
    const client = await this.pool.connect();
    return client
      .query(`
        SELECT 
            r.nombre AS nombre_rol,
            STRING_AGG(p.nombre, ', ' ORDER BY p.nombre) AS permisos
        FROM rol r
        JOIN rolxpermiso rp ON r.id = rp.id_rol
        JOIN permiso p ON rp.id_permiso = p.id
        where rp.id_rol = $1
        GROUP BY r.nombre`,
        [rolXpermisoDataXid.id_rol])
      .then((data) => {
        if (data && data.rowCount && data.rowCount > 0) return data.rows[0];
        throw {
          ok: false,
          status_cod: 409,
          data: "Este rol no tiene permisos asignados", 
        };
      })
      .catch((error) => {
        throw {
          ok: false,
          status_cod: error.status_cod || 400,
          data: error.data || "Ocurrió un error consultando el rolXpermiso",
        };
      })
      .finally(() => client.release());
  }
}

export default RolxPermisosAdapter;
