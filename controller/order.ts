import Order from "models/order";
import Product from "models/product";
import asyncHandler from "express-async-handler";
import { orderSchema } from "validators/order";

//create order --------------------------------------------------------------------------------

const calculateTotalAmount = (products: { quantity: number; price: number }[]) => {
  return products.reduce((total, item) => total + item.quantity * item.price, 0);
};

export const createOrder = asyncHandler(async (req: any, res: any) => {
  try {
    // Check if body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log("Empty request body");
      return res.status(400).json({
        error: "Request body is empty",
      });
    }

    // Validate request body with Zod
    console.log("Starting validation...");
    const parsed = orderSchema.safeParse(req.body);
    if (!parsed.success) {
      console.log("Validation failed!");
      console.log(
        "Validation errors:",
        JSON.stringify(parsed.error.errors, null, 2)
      );
      // Format validation errors
      const formattedErrors = parsed.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
        received: err.code === "invalid_type"
          ? typeof (err as any).received
          : undefined,
      }));
      return res.status(400).json({
        error: "Validation failed",
        details: formattedErrors,
      });
    }   
    console.log("Validation passed!");
    console.log("Parsed data:", JSON.stringify(parsed.data, null, 2));

    const { user, products } = parsed.data;
    const userId = req.params.userId;

    if (user !== userId) {
      return res.status(400).json({
        error: "User ID in body does not match URL parameter",
      });
    }

    // Fetch actual product prices from database
    const productIds = products.map(item => item.product);
    const dbProducts = await Product.find({ _id: { $in: productIds } }).select('_id price');
    
    if (dbProducts.length !== products.length) {
      return res.status(400).json({
        error: "One or more products not found",
      });
    }

    const priceMap = new Map(
      dbProducts.map(product => [product._id.toString(), product.price])
    );

    const productsWithPrices = products.map((item) => {
      const actualPrice = priceMap.get(item.product);
      if (!actualPrice) {
        throw new Error(`Price not found for product: ${item.product}`);
      }
      return {
        ...item,
        price: actualPrice,
      };
    });

    const totalAmount = calculateTotalAmount(productsWithPrices);

    // Create new order
    const newOrder = new Order({
      user,
      products: productsWithPrices,
      totalAmount,
      status: "Pending",
    });

    const savedOrder = await newOrder.save();
    console.log("Order created successfully:", savedOrder);
    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ message: "Server error", error });
  }
});



//get orders by userId--------------------------------------------------------------------------------
export const getOrdersByUserId = asyncHandler(async (req: any, res: any) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ user: userId }).populate('products.product', 'name price description image category subCategory size color discount');

    if (!orders || orders.length === 0) {
      console.log("No orders found for user ID:", userId);
      return res.status(404).json({ message: "No orders found for the user" });
    }

    return res.status(200).json({
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Server error", error });
  }
});