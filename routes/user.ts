import express from 'express';
import * as userController from '../controller/user.ts';
import { validate } from "../middleware/validation";
import { userSchema } from "../validators/user";
const router = express.Router();

router.post('/',validate(userSchema), userController.createUser);
router.get('/:id', userController.getUserById); 
router.post('/login', userController.loginUser); 
router.get('/', userController.getAllUsers);
router.delete('/:id', userController.deleteUser);
router.put('/:id', validate(userSchema), userController.updateUser);

export default router;