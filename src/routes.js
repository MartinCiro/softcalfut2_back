const { Router } = require('express');

const authRoutes = require('./modules/auth/routes/auth.routes');
const permisoRoutes = require('./modules/permisos/routes/permisos.routes');
const rolRoutes = require('./modules/roles/routes/roles.routes');
const usuarioRoutes = require('./modules/usuarios/routes/usuarios.routes');


const router = Router();

// Status api endpoint
router.get('/api-status', (req, res) => {
    return res.send({ 'status': 'on' });
});

router.use(authRoutes);
router.use(permisoRoutes);
router.use(rolRoutes);
router.use(usuarioRoutes);

module.exports = router;