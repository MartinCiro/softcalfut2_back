import { Router } from 'express';
import { crearEstadoController, obtenerEstadosController, delEstadoController } from '../../core/estados/controllers/estadoController';  // Importamos los controladores

const router = Router();

router.post('/estados', crearEstadoController); 
router.get('/estados', obtenerEstadosController);
router.delete('/estados', delEstadoController);

export default router;
