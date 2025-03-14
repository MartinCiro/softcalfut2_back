import { Usuario } from './entities/Usuario';
import { generateJWT } from './service/jwtService';
import { natsService } from 'src/lib/nats';
import { Injectable, Inject } from '@nestjs/common';
import { ResponseBody } from 'api/models/ResponseBody';
import { RedisService } from 'shared/cache/redis.service';
import AuthPort from './authPort';

@Injectable()
export default class AuthService {
    constructor(
        @Inject('AuthPort') private authPort: AuthPort,
        private readonly redisService: RedisService
    ) {}

    async loginUser({ username, password }: { username: string; password: string }): Promise<ResponseBody<any>> {
        try {
            const usuarioRetrieved = await this.authPort.retrieveUser({ username });
            const isPasswordValid = new Usuario(
                usuarioRetrieved.id_user,
                usuarioRetrieved.password,
                usuarioRetrieved.id_rol,
                usuarioRetrieved.estado,
                true
            ).comparePassword(password);

            if (!isPasswordValid) throw new Error('Usuario o contraseña inválida');

            // Verificar si el JWT ya existe en Redis
            const userCacheKey = `user:${usuarioRetrieved.id_user}`;
            const cachedToken = await this.redisService.get(userCacheKey);

            let token;
            if (cachedToken) {
                // Si ya existe un token válido, usarlo
                token = cachedToken;
            } else {
                // Generar un nuevo JWT
                token = generateJWT({
                    id_user: usuarioRetrieved.id_user,
                    nombre: usuarioRetrieved.usuario,
                    id_rol: usuarioRetrieved.id_rol
                });

                // Almacenar el token en Redis con un TTL de 1 hora
                await this.redisService.set(userCacheKey, token);
            }

            // Verificar si el evento ya fue creado
            const eventKey = `event:usuario.logeado:${usuarioRetrieved.id_user}`;
            const eventExists = await this.redisService.get(eventKey);

            if (!eventExists) {
                await natsService.publish('usuario.logeado', {
                    id_user: usuarioRetrieved.id_user,
                    usuario: usuarioRetrieved.usuario,
                    id_rol: usuarioRetrieved.id_rol,
                    rol: usuarioRetrieved.rol,
                    permisos: usuarioRetrieved.permisos,
                    timestamp: new Date().toISOString()
                });

                // Almacenar una marca en Redis para evitar duplicados
                await this.redisService.set(eventKey, 'true');
            }

            return {
                ok: true,
                statusCode: 200,
                result: {
                    token, // Devuelve el token JWT generado
                    usuario: {
                        id: usuarioRetrieved.id_user,
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