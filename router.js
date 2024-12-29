import userRouter from './routers/user.routes.js';

import { Router } from 'express';
const router = Router();

router.use("/user", userRouter)

export default router;