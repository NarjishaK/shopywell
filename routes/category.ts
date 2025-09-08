import express from "express";
import * as categoryController from "../controller/category";
import { createS3Uploader } from "../middleware/multer";
import dotenv from "dotenv";
import { validate } from "../middleware/validation";
import { categorySchema } from "../validators/category";
dotenv.config();
const router = express.Router();
const upload = createS3Uploader("image", 1);


//category routes
router.post("/", upload, validate(categorySchema), categoryController.createCategory);
router.get("/", categoryController.getAllCategories);
router.delete("/:id", categoryController.deleteCategory);

export default router;
