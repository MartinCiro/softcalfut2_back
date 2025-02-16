import { Router } from 'express';
import { crearRolxPermisoController, obtenerRolxPermisosController } from '../../core/rolXpermisos/controllers/rolXpermisoController';

import { isAuthenticatedMW, checkPermissions } from './middleware/authMiddleware';

const router = Router();

router.post('/rolXpermisos', crearRolxPermisoController); 
router.get('/rolXpermisos', obtenerRolxPermisosController);
router.patch('/rolXpermisos', crearRolxPermisoController);

export default router;
