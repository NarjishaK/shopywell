import express from 'express';
import * as orderController from '../controller/order';
const router = express.Router();

//order routes
router.post('/:userId', orderController.createOrder);
router.get('/:userId', orderController.getOrdersByUserId);

export default router;