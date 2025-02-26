import { Router } from 'express';
import { crearOrdenEnvioController, obtenerOrdenEnviosController, delOrdenEnvioController, upOrdenEnvioController } from '../../core/ordenEnvios/controllers/ordenEnvioController';
import { isAuthenticatedMW, checkPermissions } from './middleware/authMiddleware';

const router = Router();

router.post('/ordenEnvios',  crearOrdenEnvioController); 
router.get('/ordenEnvios', isAuthenticatedMW, checkPermissions([1, 2]), obtenerOrdenEnviosController);
router.delete('/ordenEnvios', delOrdenEnvioController);
router.patch('/ordenEnvios', upOrdenEnvioController);
export default router;
