import express from 'express';
import * as userController from '../controller/user.ts';

const router = express.Router();

// Create user route
router.post('/', userController.createUser);

export default router;