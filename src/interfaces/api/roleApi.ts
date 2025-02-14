import { Router } from 'express';
import { crearRolController, obtenerRolesController } from '../../core/roles/controllers/roleController';  // Importamos los controladores

const router = Router();

router.post('/roles', crearRolController); 
router.get('/roles', obtenerRolesController);

export default router;
