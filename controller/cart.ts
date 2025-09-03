import Cart from "models/cart";
import { cartSchema } from "validators/cart";
import asyncHandler from "express-async-handler";

//add to cart--------------------------------------------------------------------------------
export const addToCart = asyncHandler(async (req: any, res: any) => {
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
    const parsed = cartSchema.safeParse(req.body);
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
        received:
          err.code === "invalid_type"
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

    const { products } = parsed.data;
    const userId = req.params.userId;

    // Find existing cart for the user
    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      // Update existing cart
      console.log("Updating existing cart...");
      for (const newItem of products) {
        const existingItemIndex = cart.products.findIndex(
          (item) => item.product.toString() === newItem.product
        );
        if (existingItemIndex > -1) {
          // If product exists in cart, update quantity
          const existingItem = cart.products[existingItemIndex];
          if (existingItem) {
            existingItem.quantity += newItem.quantity;
          }
        } else {
          // If product does not exist, add new item
          cart.products.push(newItem);
        }
      }
    } else {
      // Create new cart
      console.log("Creating new cart...");
      cart = new Cart({
        user: userId,
        products,
      });
    }

    await cart.save();
    console.log("Cart saved successfully");
    return res.status(200).json({
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).json({ message: "Server error", error });
  }
});
