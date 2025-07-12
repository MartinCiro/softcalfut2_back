import jwt from 'jsonwebtoken';
import config from 'src/config';

interface JwtPayload {
    userInfo: any;
    documento: string;
    id_rol: number;
    exp?: number;
    doc?: string;
}

export const generateJWT = (userInfo: any): { accessToken: string, refreshToken: string } => {
    if (!config.JWT_SECRETO) throw new Error("JWT_SECRETO no está definido en la configuración.");
    const accessToken = jwt.sign({ userInfo }, config.JWT_SECRETO, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userInfo }, config.JWT_SECRETO, { expiresIn: '1h' });
    return { accessToken, refreshToken };
};

export const verifyToken = async (token: string, isRefreshToken: boolean = false): Promise<{ userInfo: JwtPayload; newAccessToken?: string }> => {
    let response: { userInfo: JwtPayload; newAccessToken?: string } = { userInfo: {} as JwtPayload };

    // Decodificar sin verificar la firma primero
    const decoded = jwt.decode(token) as JwtPayload | null;

    if (!decoded || !decoded.userInfo?.doc) throw { ok: false, status_cod: 401, data: "El token es inválido" };

    // Entorno de desarrollo: retornar sin verificar
    if (config.env === 'dev') return { userInfo: decoded };

    try {
        if (!config.JWT_SECRETO) throw new Error("JWT_SECRETO no está definido en la configuración.");

        // Verificar el token
        const verified = jwt.verify(token, config.JWT_SECRETO) as JwtPayload;
        response.userInfo = verified;

        // Solo para access tokens, no para refresh tokens
        if (!isRefreshToken && verified.exp) {
            const expireDate = new Date(verified.exp * 1000);
            const now = new Date();
            const diffMins = Math.round((expireDate.getTime() - now.getTime()) / 60000);

            // Regenerar access token si le quedan menos de 5 minutos
            if (diffMins < 5) response.newAccessToken = generateJWT(verified.userInfo).accessToken;
        }

        return response;
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            const message = isRefreshToken
                ? 'Refresh token expirado. Por favor inicie sesión nuevamente'
                : 'Access token expirado. Use el refresh token para obtener uno nuevo';
            throw { ok: false, status_cod: 401, data: message };
        }
        throw { ok: false, status_cod: 401, data: "Token inválido" };
    }
};

export const refreshAccessToken = async (refreshToken: string): Promise<{ accessToken: string }> => {
    // Verificar el refresh token
    const { userInfo } = await verifyToken(refreshToken, true);

    // Generar nuevo access token
    const { accessToken } = generateJWT(userInfo);

    return { accessToken };
};
