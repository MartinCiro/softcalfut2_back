import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../../../core/auth/service/jwtService';
import { ResponseBody } from '../../../interfaces/api/models/ResponseBody';
import config from '../../../config';


const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
interface dataUser extends Request {
    userData?: any; 
}

export const isAuthenticatedMW = async (req: dataUser, res: Response, next: NextFunction): Promise<void> => {
    const token: string | undefined = req.get("jwt") || req.get("Authorization");

    if (!token) {
        res.status(403).json(new ResponseBody(false, 403, 'No se ha proporcionado token' ));
        return;
    }

    if (!jwtRegex.test(token)) {
        res.status(403).json(new ResponseBody(false, 403, 'No se ha proporcionado un token válido' ));
        return;
    }

    try {
        const verifyResponse = await verifyJWT(token);
        req.userData = verifyResponse.userInfo;
        if (verifyResponse.jwt) res.set('new_token', verifyResponse.jwt);
        next();
    } catch (error) {
        if (typeof error === "object" && error !== null && "status_cod" in error) {
            const err = error as { ok: boolean; status_cod: number; data: any };
            res.status(err.status_cod).json(new ResponseBody(err.ok, err.status_cod, err.data));
            return;
        }
    
        if ((error as any).result) {
            res.status((error as any).statusCode || 500).json(new ResponseBody(false, (error as any).statusCode || 500, (error as any).result));
            return;
        }
    
        res.status(500).json(new ResponseBody(false, 500, "Error interno del servidor"));
        return 
    }
    
};

export const checkPermissions = (roles: number[]) => {
    if (!Array.isArray(roles)) throw new Error("Se debe especificar un array de números para los roles");
    

    return (req: dataUser, res: Response, next: NextFunction): void => {
        if (!req.userData) {
            res.status(401).json(new ResponseBody(false, 401, "No autorizado"));
            return;
        }

        const { id_rol } = req.userData;

        if (!id_rol && config.env === "Dev") {
            console.warn("No se encontró `id_rol` en desarrollo. Permitiendo el acceso.");
            next();
            return;
        }

        if (!id_rol || !roles.includes(id_rol)) {
            res.status(403).json(new ResponseBody(false, 403, "No posee permisos para realizar esta acción"));
            return;
        }

        next();
    };
};
