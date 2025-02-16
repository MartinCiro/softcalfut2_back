import { Router } from 'express';
import { crearPermisoController, obtenerPermisosController, delPermisoController, upPermisoController } from '../../core/permisos/controllers/permisoController';  // Importamos los controladores
import { isAuthenticatedMW, checkPermissions } from './middleware/authMiddleware';

const router = Router();

router.post('/permisos',  crearPermisoController); 
router.get('/permisos', obtenerPermisosController);
router.delete('/permisos', delPermisoController);
router.patch('/permisos', upPermisoController);

export default router;
