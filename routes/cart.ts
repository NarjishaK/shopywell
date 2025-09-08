import express from "express";
import * as cartController from "../controller/cart";
import { validate } from "../middleware/validation";
import { cartSchema } from "../validators/cart";
const router = express.Router();

//cart routes
router.post("/:userId", validate(cartSchema), cartController.addToCart);
router.put("/:userId", validate(cartSchema), cartController.updateCart);
router.get("/:userId", cartController.getCartByUserId);
router.delete("/:userId", cartController.clearCartByUserId);
router.delete("/:userId/:productId", cartController.deleteCartItemByProductId);

export default router;
