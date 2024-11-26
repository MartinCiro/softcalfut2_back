const { Router } = require('express');

// api handlers
const { crearEquiposAPI, actualizarEquiposAPI, listarEquiposAPI, deleteEquiposAPI } = require('../api/equipos.api');
const { isAuthenticatedMW, checkPermissions } = require('../../auth/api/auth.api');

const router = Router();

/**
 *  {
 *      headers: {
 *          Authorization | jwt: string,
 *      },
 *      query: {
 *          id_cliente: number
 *      }
 *  }
 */
router.get('/equipos', isAuthenticatedMW, checkPermissions([1, 2]), listarEquiposAPI)
router.post('/equipos', isAuthenticatedMW, checkPermissions([1, 2, 3]), crearEquiposAPI)
router.patch('/equipos', isAuthenticatedMW, checkPermissions([1, 2]), actualizarEquiposAPI)
router.delete('/equipos', isAuthenticatedMW, checkPermissions([1]), deleteEquiposAPI)

module.exports = router;