import { Usuario } from './entities/Usuario';
import { generateJWT } from './service/jwtService';
import { connectToNATS } from '../../lib/nats';

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
            // Recuperar usuario de la base de datos
            const usuarioRetrieved = await this.authPort.retrieveUser({ email });
            if (!usuarioRetrieved) throw new Error('Usuario o contraseña inválida');
            console.log(usuarioRetrieved)
            
            // Comparar contraseñas
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
                id_rol: usuarioRetrieved.id_rol 
            });
    
            // Publicar evento de login exitoso
            const nc = await connectToNATS();
            nc.publish('usuario.logeado', JSON.stringify({ 
                id_user: usuarioRetrieved.id_user, 
                usuario: usuarioRetrieved.usuario, 
                timestamp: new Date().toISOString() 
            }));
    
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
            console.error('Error en loginUser:', error);
            return {
                ok: false,
                statusCode: 401,
                result: 'Usuario o contraseña inválida'
            };
        }
    }
    
}
