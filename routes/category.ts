import express from "express";
import * as categoryController from "../controller/category";
import multer from "multer";
import multerS3 from "multer-s3";
import s3Client from "../config/s3";
import dotenv from "dotenv";
import { validate } from "../middleware/validation";
import { categorySchema } from "../validators/category";
dotenv.config();

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET_NAME as string,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const fileName = Date.now().toString() + "-" + file.originalname;
      cb(null, fileName);
    },
  }),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
}).fields([{ name: "image", maxCount: 1 }]);

const router = express.Router();

//category routes
router.post("/", upload, validate(categorySchema), categoryController.createCategory);
router.get("/", categoryController.getAllCategories);

export default router;
