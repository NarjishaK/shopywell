import express from "express";
import * as cartController from "../controller/cart";
const router = express.Router();

//cart routes
router.post("/:userId", cartController.addToCart);
router.put("/:userId", cartController.updateCart);
router.get("/:userId", cartController.getCartByUserId);
router.delete("/:userId", cartController.clearCartByUserId);
router.delete("/:userId/:productId", cartController.deleteCartItemByProductId);

export default router;
