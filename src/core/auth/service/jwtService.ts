import jwt from 'jsonwebtoken';
import config from '../../../config';

interface JwtPayload {
    id_user: number;
    username: string;
    id_rol: number;
    exp?: number;
}

export const generateJWT = (userInfo: any): string => {
    return jwt.sign({ userInfo }, config.JWT_SECRETO, { expiresIn: config.JWT_TIEMPO_EXPIRA });
};

export const verifyJWT = async (token: string): Promise<{ userInfo: JwtPayload; jwt?: string }> => {
    let response: { userInfo: JwtPayload; jwt?: string } = { userInfo: {} as JwtPayload };

    // Decodificar sin verificar la firma
    const decoded = jwt.decode(token) as JwtPayload | null;

    if (!decoded || !decoded.id_user)  throw { message: 'El JWT es incorrecto' };

    // Si está en entorno de desarrollo, retornar sin verificar
    if (config.env === 'Dev') return { userInfo: decoded };

    try {
        // Verificar el token
        const verified = jwt.verify(token, config.JWT_SECRETO) as JwtPayload;

        // Calcular tiempo restante hasta la expiración
        if (verified.exp) {
            const expireDate = new Date(verified.exp * 1000);
            const now = new Date();
            const diffMins = Math.round((expireDate.getTime() - now.getTime()) / 60000);

            // Regenerar token si le quedan menos de 10 minutos
            if (diffMins < 10)  response.jwt = generateJWT(verified);
        }

        response.userInfo = verified;
        return response;

    } catch (error: any) {
        throw error.name === 'TokenExpiredError' ? { message: 'JWT expirado. Por favor inicie sesión nuevamente' } : { message: 'El JWT es inválido' };
    }
};

