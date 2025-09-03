import express from 'express';
import * as userController from '../controller/user.ts';

const router = express.Router();

router.post('/', userController.createUser);
router.get('/:id', userController.getUserById); 
router.post('/login', userController.loginUser); 

export default router;