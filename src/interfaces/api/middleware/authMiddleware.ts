import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../../../core/auth/service/jwtService';
import { ResponseBody } from '../../../core/common/response';

const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

export const isAuthenticatedMW = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token: string | undefined = req.get("jwt") || req.get("Authorization");

    if (!token) {
        res.status(403).json(new ResponseBody(false, 403, { message: 'No se ha proporcionado token' }));
        return;
    }

    if (!jwtRegex.test(token)) {
        res.status(403).json(new ResponseBody(false, 403, { message: 'No se ha proporcionado un token válido' }));
        return;
    }

    try {
        const verifyResponse = await verifyJWT(token);
        req.userData = verifyResponse.userInfo;
        if (verifyResponse.jwt) {
            res.set('new_token', verifyResponse.jwt);
        }
        next();
    } catch (error) {
        res.status(error.message ? 403 : 500).json(new ResponseBody(false, error.message ? 403 : 500, error.message ? error : { message: 'Ocurrió un error validando el token del cliente. Por favor intente más tarde' }));
    }
};
