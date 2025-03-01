import { Usuario } from './entities/Usuario';
import { generateJWT } from './service/jwtService';
import { natsService } from '../../lib/nats';

import { Injectable, Inject } from '@nestjs/common';
import AuthPort from './authPort';
import { ResponseBody } from '../../interfaces/api/models/ResponseBody';

@Injectable() 
export default class AuthService {
    constructor(
        @Inject('AuthPort') private authPort: AuthPort
      ) {}

      async loginUser({ email, password }: { email: string; password: string }): Promise<ResponseBody<any>> {
        try {
            const usuarioRetrieved = await this.authPort.retrieveUser({ email });
            if (!usuarioRetrieved) throw new Error('Usuario o contraseña inválida');
            
            const isPasswordValid = new Usuario(
                usuarioRetrieved.id_user,
                usuarioRetrieved.password, 
                usuarioRetrieved.id_rol,
                usuarioRetrieved.status,
                true
            ).comparePassword(password);
            if (!isPasswordValid) throw new Error('Usuario o contraseña inválida');
            
            // Generar el JWT
            const token = generateJWT({ 
                id_user: usuarioRetrieved.id_user, 
                nombre: usuarioRetrieved.usuario, 
                id_rol: usuarioRetrieved.id_rol,
                permisos: usuarioRetrieved.permisos 
            });
            // Publicar el evento
            await natsService.publish('usuario.logeado', { 
                id_user: usuarioRetrieved.id_user, 
                usuario: usuarioRetrieved.usuario,
                id_rol: usuarioRetrieved.id_rol,
                rol: usuarioRetrieved.rol,
                permisos: usuarioRetrieved.permisos,  
                timestamp: new Date().toISOString() 
            });
            
            return {
                ok: true,
                statusCode: 200,
                result: {
                    token,
                    usuario: {
                        email: usuarioRetrieved.id_user,
                        nombre: usuarioRetrieved.usuario,
                        rol: usuarioRetrieved.id_rol
                    }
                }
            };
        } catch (error) {
            return {
                ok: false,
                statusCode: 401,
                result: 'Usuario o contraseña inválida'
            };
        }
    }
    
}
