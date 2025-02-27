import { Router } from 'express';
import { loginAPI } from './auth/authController';

const router = Router();

router.post('/auth/login', loginAPI);

//router.post('/auth/create/user',isAuthenticatedMW, checkPermissions([1, 2]), createUserAPI);

export default router;
