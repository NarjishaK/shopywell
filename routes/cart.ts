import express from "express";
import * as cartController from "../controller/cart";
const router = express.Router();

//cart routes
router.post("/:userId", cartController.addToCart);

export default router;
