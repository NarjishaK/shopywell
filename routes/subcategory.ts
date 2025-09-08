import express from 'express';
import * as subcategoryController from '../controller/subcategory';
import { validate } from "../middleware/validation";
import { subcategorySchema } from "../validators/subcategory";
const router = express.Router();

router.post('/',  validate(subcategorySchema), subcategoryController.createSubCategory);
router.get('/', subcategoryController.getAllSubCategories);

export default router;