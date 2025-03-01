import { PrismaClient } from '@prisma/client';
import AuthPort from '../../core/auth/authPort';
import { validarExistente } from '../api/utils/validaciones';

const prisma = new PrismaClient();

class AuthAdapter implements AuthPort {

  async retrieveUser(authData: { email: string }) {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { email: authData.email.toLowerCase() },
        select: {
          email: true,
          nombre: true,
          passwd: true,
          id_rol: true,
          rol: { 
            select: {
              nombre: true,
              rolXPermiso: {
                select: {
                  permiso: { select: { nombre: true } }
                }
              }
            }
          }
        },
      });
      if (!usuario) return null;

      return {
        id_user: usuario.email,
        usuario: usuario.nombre,
        password: usuario.passwd,
        id_rol: usuario.id_rol,
        rol: usuario.rol?.nombre || null,
        permisos: usuario.rol?.rolXPermiso.map(rp => rp.permiso.nombre) || []
      };

    } catch (error: any) {
      const validacion = validarExistente(error.code, authData.email.toString());
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
    }
  }

}

export default AuthAdapter;
