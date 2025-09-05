import express from 'express';
import * as userController from '../controller/user.ts';
import { validate } from "../middleware/validation";
import { userSchema } from "../validators/user";
const router = express.Router();

router.post('/',validate(userSchema), userController.createUser);
router.get('/:id', userController.getUserById); 
router.post('/login', userController.loginUser); 

export default router;