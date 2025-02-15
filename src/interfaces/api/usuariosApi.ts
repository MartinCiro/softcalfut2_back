import { Router } from 'express';
import { crearUsuarioController, obtenerUsuariosController, delUsuarioController, upUsuarioController } from '../../core/usuarios/controllers/usuarioController';  // Importamos los controladores

const router = Router();

router.post('/usuarios', crearUsuarioController); 
router.get('/usuarios', obtenerUsuariosController);
router.delete('/usuarios', delUsuarioController);
router.patch('/usuarios', upUsuarioController);

// quien manda, saber quien recibe, nombre completo, telefono quien envia, direccion de quien envia, identificacion de quien envia
//comun: peso, dimensiones, que contiene, tipo de envio (mercancia, mensajeria), validacion de que la direccion destino sea valida 

//asignacion de rutas -> datos transporcita, capacidad de vehiculo, tipo de vehiculo, al transporcita se le asigna un origen y destino dependiendo de la UBICACION ACTUAL del transporcita
//buscar api de validacion de direcciones, json para simplificar o validar que tenga una nomenclatura en especifico

//orden en registro -> inicial "En espera" (defecto)

export default router;
