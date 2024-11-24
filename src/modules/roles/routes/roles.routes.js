const { Router } = require('express');
const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

// api handlers
const { crearRolesAPI, actualizarRolesAPI, listarRolesAPI, deleteRolesAPI } = require('../api/roles.api');
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
router.get('/roles', isAuthenticatedMW, checkPermissions([1, 2]), listarRolesAPI)

router.post('/roles', isAuthenticatedMW, checkPermissions([1, 2]), crearRolesAPI)
router.patch('/roles', isAuthenticatedMW, checkPermissions([1, 2]), actualizarRolesAPI)
router.delete('/roles', isAuthenticatedMW, checkPermissions([1, 2]), deleteRolesAPI)

module.exports = router;