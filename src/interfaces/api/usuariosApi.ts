import { Router } from 'express';
import { crearUsuarioController, obtenerUsuariosController, delUsuarioController, upUsuarioController } from '../../core/usuarios/controllers/usuarioController';  // Importamos los controladores

const router = Router();

router.post('/usuarios', crearUsuarioController); 
router.get('/usuarios', obtenerUsuariosController);
router.delete('/usuarios', delUsuarioController);
router.patch('/usuarios', upUsuarioController);

export default router;
