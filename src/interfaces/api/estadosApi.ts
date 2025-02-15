import { Router } from 'express';
import { crearEstadoController, obtenerEstadosController, delEstadoController, upEstadoController } from '../../core/estados/controllers/estadoController';  // Importamos los controladores
import { isAuthenticatedMW, checkPermissions } from './middleware/authMiddleware';

const router = Router();

router.post('/estados',  crearEstadoController); 
router.get('/estados', isAuthenticatedMW, checkPermissions([1, 2]), obtenerEstadosController);
router.delete('/estados', delEstadoController);
router.patch('/estados', upEstadoController);

export default router;
