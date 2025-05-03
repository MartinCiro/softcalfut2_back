import { PrismaClient } from '@prisma/client';
import AuthPort from 'core/auth/authPort';
import { validarExistente } from 'api/utils/validaciones';

const prisma = new PrismaClient();

class AuthAdapter implements AuthPort {

  async retrieveUser(authData: { documento: string }) {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { documento: authData.documento },
        select: {
          documento: true,
          nombres: true,
          apellido: true,
          pass: true,
          id_rol: true,
          estado: {  
            select: {
              nombre: true
            }
          },
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
        id_user: usuario.documento,
        usuario: usuario.nombres + " " + usuario.apellido,
        password: usuario.pass,
        id_rol: usuario.id_rol,
        estado: usuario.estado.nombre,
        rol: usuario.rol.nombre,
        permisos: usuario.rol?.rolXPermiso.map((rp: { permiso: { nombre: any; }; }) => rp.permiso.nombre) || []
      };

    } catch (error: any) {
      const validacion = validarExistente(error.code, authData.documento);
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
