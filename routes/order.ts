import express from 'express';
import * as orderController from '../controller/order';
import { validate } from "../middleware/validation";
import { orderSchema } from "../validators/order";
const router = express.Router();

//order routes
router.post('/:userId', validate(orderSchema), orderController.createOrder);
router.get('/:userId', orderController.getOrdersByUserId);
router.get('/', orderController.getAllOrders);
router.delete('/:id', orderController.deleteOrder);

export default router;