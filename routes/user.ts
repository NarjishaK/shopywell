import express from 'express';
import * as userController from '../controller/user.ts';

const router = express.Router();

router.post('/', userController.createUser);
router.get('/:id', userController.getUserById); 
router.post('/login', userController.loginUser); 
// Update user route
// router.put('/:id', userController.updateUser); // Uncomment and implement if needed
// Delete user route
// router.delete('/:id', userController.deleteUser); // Uncomment and implement if needed

export default router;