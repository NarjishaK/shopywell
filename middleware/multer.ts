import multer from "multer";
import multerS3 from "multer-s3";
import s3Client from "../config/s3";
import dotenv from "dotenv";

dotenv.config();

/**
 * Factory function to create multer upload middleware
 * @param fieldName - name of the form field
 * @param maxCount - maximum number of files
 */
export const createS3Uploader = (fieldName: string, maxCount: number) => {
  return multer({
    storage: multerS3({
      s3: s3Client,
      bucket: process.env.AWS_BUCKET_NAME as string,
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        const fileName = `${Date.now().toString()}-${file.originalname}`;
        cb(null, fileName);
      },
    }),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  }).fields([{ name: fieldName, maxCount }]);
};
