const { Router } = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

// api handlers
const { crearUsuariosAPI, actualizarUsuariosAPI, listarUsuariosAPI, deleteUsuariosAPI } = require('../api/usuarios.api');
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
router.get('/usuarios', isAuthenticatedMW, checkPermissions([1, 2]), listarUsuariosAPI)
router.post('/usuarios', isAuthenticatedMW, checkPermissions([1, 2, 3]), crearUsuariosAPI)
router.patch('/usuarios',  isAuthenticatedMW, checkPermissions([1]), actualizarUsuariosAPI)
router.delete('/usuarios', isAuthenticatedMW, checkPermissions([1]), deleteUsuariosAPI)

module.exports = router;