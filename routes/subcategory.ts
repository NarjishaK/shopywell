import express from 'express';
import * as subcategoryController from '../controller/subcategory';

const router = express.Router();

router.post('/', subcategoryController.createSubCategory);
router.get('/', subcategoryController.getAllSubCategories);

export default router;