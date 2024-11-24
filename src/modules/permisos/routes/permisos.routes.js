const { Router } = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

// api handlers
const { crearPermisosAPI, actualizarPermisosAPI, listarPermisosAPI, deletePermisosAPI } = require('../api/permisos.api');
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
router.get('/permisos', isAuthenticatedMW, checkPermissions([1, 2]), listarPermisosAPI)
router.post('/permisos', isAuthenticatedMW, checkPermissions([1, 2]), crearPermisosAPI)
router.patch('/permisos', isAuthenticatedMW, checkPermissions([1, 2]), actualizarPermisosAPI)
router.delete('/permisos', isAuthenticatedMW, checkPermissions([1, 2]), deletePermisosAPI)

module.exports = router;