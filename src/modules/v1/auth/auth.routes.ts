import express from 'express';

import { register, login } from './auth.controller';
import { registerSchema, loginSchema } from './auth.api.schema';
import { validate } from '../../../middlewares/validateApiSchema';

const router = express.Router();

router.post('/login', validate(loginSchema), login);
router.post('/register', validate(registerSchema), register);

export default router;
