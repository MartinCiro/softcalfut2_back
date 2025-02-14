import { Router, Request, Response } from 'express';
import roleRouters from './interfaces/api/roleApi';
import estadoRoutes from './interfaces/api/estadosApi';

const router = Router();

router.use(roleRouters);
router.use(estadoRoutes);

// Endpoint para verificar el estado de la API
router.get('/api-status', (req: Request, res: Response) => {
    res.status(200);
    res.send({ status: 'on' });
});

export default router; 