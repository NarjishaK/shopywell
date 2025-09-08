import Order from "models/order";
import Product from "models/product";
import asyncHandler from "express-async-handler";
import User from "models/user";

//create order --------------------------------------------------------------------------------

const calculateTotalAmount = (
  products: { quantity: number; price: number }[]
) => {
  return products.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );
};

export const createOrder = asyncHandler(async (req: any, res: any) => {
  try {
    // Check if body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log("Empty request body");
      return res.status(400).json({
        success: false,
        message: "Request body is empty",
        error: "Request body is empty",
      });
    }

    const { user, products, shippingAddress } = req.body;
    const userId = req.params.userId;

    if (user !== userId) {
      return res.status(400).json({
        success: false,
        message: "User ID in body does not match URL parameter",
        error: "User ID in body does not match URL parameter",
      });
    }

    // Verify user exists
    const userDoc = await User.findById(userId);
    if (!userDoc) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: "User not found",
      });
    }

    // Fetch actual product prices from database
    const productIds = products.map((item: any) => item.product);
    const dbProducts = await Product.find({ _id: { $in: productIds } }).select(
      "_id price"
    );

    if (dbProducts.length !== products.length) {
      return res.status(400).json({
        success: false,
        message: "One or more products not found",
        error: "One or more products not found",
      });
    }

    const priceMap = new Map(
      dbProducts.map((product) => [product._id.toString(), product.price])
    );

    const productsWithPrices = products.map((item: any) => {
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

    // Create new order with selected shipping address
    const newOrder = new Order({
      user,
      products: productsWithPrices,
      shippingAddress,
      totalAmount,
      status: "Pending",
    });

    const savedOrder = await newOrder.save();
    console.log("Order created successfully:", savedOrder);
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
});

//get orders by userId--------------------------------------------------------------------------------
export const getOrdersByUserId = asyncHandler(async (req: any, res: any) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ user: userId })
      .populate(
        "products.product",
        "name price description image category subCategory size color discount"
      )
      .populate("user", "name email addresses phone");

    if (!orders || orders.length === 0) {
      console.log("No orders found for user ID:", userId);
      return res.status(404).json({
        success: false,
        message: "No orders found for the user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
});
