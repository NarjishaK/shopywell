import express from 'express';
import * as productController from '../controller/product';
import multer from 'multer';
import multerS3 from 'multer-s3';
import s3Client from '../config/s3';
import dotenv from 'dotenv';
dotenv.config();

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET_NAME as string,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const fileName = Date.now().toString() + '-' + file.originalname;
      cb(null, fileName);
    },
  }),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
}).fields([{ name: 'images', maxCount: 5 }]);

const router = express.Router();
//product routes
router.post('/', upload, productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

export default router;