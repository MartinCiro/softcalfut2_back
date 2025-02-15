import { Router } from 'express';
import { loginAPI } from '../../core/auth/controllers/authController';

const router = Router();

router.post('/auth/login', loginAPI);

//router.post('/auth/create/user',isAuthenticatedMW, checkPermissions([1, 2]), createUserAPI);

export default router;
