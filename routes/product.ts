import express from 'express';
import * as productController from '../controller/product';
import { createS3Uploader } from '../middleware/multer';
import dotenv from 'dotenv';
dotenv.config();

const upload = createS3Uploader("images", 10);
const router = express.Router();
//product routes
router.post('/', upload, productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.delete('/:id', productController.deleteProduct);

export default router;