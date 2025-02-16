import { Router, Request, Response } from 'express';
import roleRouters from './interfaces/api/roleApi';
import estadoRoutes from './interfaces/api/estadosApi';
import usuarioRoutes from './interfaces/api/usuariosApi';
import authRoutes from './interfaces/api/authApi';
import rolxPermisoRoutes from './interfaces/api/rolXpermisoApi';
import permisoRoutes from './interfaces/api/permisosApi';

const router = Router();

router.use(roleRouters);
router.use(estadoRoutes);
router.use(usuarioRoutes);
router.use(authRoutes);
router.use(rolxPermisoRoutes);
router.use(permisoRoutes);

// Endpoint para verificar el estado de la API
router.get('/api-status', (req: Request, res: Response) => {
    res.status(200);
    res.send({ status: 'on' });
});

export default router; 