import { Router } from 'express';
import { crearRolController, obtenerRolController, delRolController, upRolController } from '../../core/roles/controllers/roleController';  // Importamos los controladores

const router = Router();

router.post('/roles', crearRolController); 
router.get('/roles', obtenerRolController);
router.delete('/roles', delRolController);
router.patch('/roles', upRolController);

export default router;
