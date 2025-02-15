// src/interfaces/db/authAdapter.ts
import { Pool } from 'pg';
import AuthPort from '../../core/auth/authPort';
import getConnection from '../DBConn';
import { validarExistente } from '../api/utils/validaciones';  


class AuthAdapter implements AuthPort {
  private pool: Pool;

  constructor() {
    this.pool = getConnection(); 
  }

  // Implementación del método para validar un usuario
  async retrieveUser(authData: { documento: string | number; }) {
    const client = await this.pool.connect();
    return client
    .query(`SELECT 
            u.documento AS id_user, 
            u.nombres AS usuario, 
            u.pass AS contrasena,
            u.apellido,
            u.id_rol AS id_rol
        FROM usuario u WHERE LOWER(u.documento) = LOWER($1)`, [authData.documento])
    .then((data) => {
      if (data && data.rowCount && data.rowCount > 0) return data.rows[0];
    })
    .catch((error) => {
      const validacion = validarExistente(error.code, authData.documento.toString());
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
        data: "Ocurrió un error consultando el auth",
      };
    })
    .finally(() => client.release());
  }
  
}

export default AuthAdapter;
