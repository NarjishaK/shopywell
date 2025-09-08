import Order from "models/order";
import Product from "models/product";
import asyncHandler from "express-async-handler";
import User from "models/user";
import { sendSuccess, sendError } from "utils/common";

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
      return sendError(res, 400, "Request body is empty");
    }

    const { user, products, shippingAddress } = req.body;
    const userId = req.params.userId;

    if (user !== userId) {
      return sendError(res, 400, "User ID mismatch");
    }

    // Verify user exists
    const userDoc = await User.findById(userId);
    if (!userDoc) {
      return sendError(res, 400, "User does not exist");
    }

    // Fetch actual product prices from database
    const productIds = products.map((item: any) => item.product);
    const dbProducts = await Product.find({ _id: { $in: productIds } }).select(
      "_id price"
    );

    if (dbProducts.length !== products.length) {
      return sendError(res, 400, "One or more products are invalid");
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
    return sendSuccess(res, 201, "Order created successfully", { order: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    return sendError(res, 500, "Server error");
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
      return sendError(res, 404, "No orders found for the user");
    }

    return sendSuccess(res, 200, "Orders fetched successfully", { orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return sendError(res, 500, "Server error");
  }
});

//get all orders--------------------------------------------------------------------------------
export const getAllOrders = asyncHandler(async (req: any, res: any) => {
  try {
    const orders = await Order.find()
      .populate(
        "products.product",
        "name price description image category subCategory size color discount"
      )
      .populate("user", "name email addresses phone");

    return sendSuccess(res, 200, "All orders fetched successfully", { orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return sendError(res, 500, "Server error");
  }
});


//delete order by id--------------------------------------------------------------------------------
export const deleteOrder = asyncHandler(async (req: any, res: any) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      console.log("Order not found with ID:", orderId);
      return sendError(res, 404, "Order not found");
    }

    return sendSuccess(res, 200, "Order deleted successfully", {});
  } catch (error) {
    console.error("Error deleting order:", error);
    return sendError(res, 500, "Server error");
  }
});