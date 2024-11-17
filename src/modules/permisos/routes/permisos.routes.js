const { Router } = require('express');
const express = require('express');
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
router.get('/permisos', listarPermisosAPI)

router.post('/permisos', crearPermisosAPI)
router.patch('/permisos', actualizarPermisosAPI)
router.delete('/permisos', deletePermisosAPI)

module.exports = router;