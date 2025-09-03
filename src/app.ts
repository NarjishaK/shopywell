import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "../config/db"; 
import path from 'path';
import userRoutes from "../routes/user"; 
import categoryRoutes from "../routes/category";
import subcategoryRoutes from "../routes/subcategory";
import productRoutes from "../routes/product";

dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join('public')));

// Add CORS headers if needed
app.use((req: Request, res: Response, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Routes
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/subcategories", subcategoryRoutes);
app.use("/products", productRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Handle 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;