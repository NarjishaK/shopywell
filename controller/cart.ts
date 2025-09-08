import Cart from "models/cart";
import asyncHandler from "express-async-handler";
import { sendSuccess, sendError } from "utils/common";

//add to cart--------------------------------------------------------------------------------
export const addToCart = asyncHandler(async (req: any, res: any) => {
  try {
    // Check if body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log("Empty request body");
      return sendError(res, 400, "Request body is empty");
    }
    const { products } = req.body;
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
    return sendSuccess(res, 200, "Cart updated successfully", { cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    return sendError(res, 500, "Server error");
  }
});

//update cart--------------------------------------------------------------------------------
export const updateCart = asyncHandler(async (req: any, res: any) => {
  try {
    // Check if body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log("Empty request body");
      return sendError(res, 400, "Request body is empty");
    }
    const { products } = req.body;
    const userId = req.params.userId;

    // Find existing cart for the user
    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      // Update existing cart
      console.log("Updating existing cart...");
      cart.products = products;
      await cart.save();
      console.log("Cart saved successfully");
      return sendSuccess(res, 200, "Cart updated successfully", { cart });
    } else {
      console.log("Cart not found for the user");
      return sendError(res, 404, "Cart not found for the user");
    }
  } catch (error) {
    console.error("Error updating cart:", error);
    return sendError(res, 500, "Server error");
  }
});

//get cart by userId--------------------------------------------------------------------------------
export const getCartByUserId = asyncHandler(async (req: any, res: any) => {
  try {
    const userId = req.params.userId;
    const cart = await Cart.findOne({ user: userId }).populate(
      "products.product",
      "name price description image category subCategory size color discount"
    );

    if (!cart) {
      console.log("Cart not found for user ID:", userId);
      return sendError(res, 404, "Cart not found for the user");
    }

    return sendSuccess(res, 200, "Cart fetched successfully", { cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return sendError(res, 500, "Server error");
  }
});

//clear cart by userId--------------------------------------------------------------------------------
export const clearCartByUserId = asyncHandler(async (req: any, res: any) => {
  try {
    const userId = req.params.userId;
    const cart = await Cart.findOneAndDelete({ user: userId });

    if (!cart) {
      console.log("Cart not found for user ID:", userId);
      return sendError(res, 404, "Cart not found for the user");
    }

    return sendSuccess(res, 200, "Cart cleared successfully", {});
  } catch (error) {
    console.error("Error clearing cart:", error);
    return sendError(res, 500, "Server error");
  }
});

//delete cart item by productId--------------------------------------------------------------------------------
export const deleteCartItemByProductId = asyncHandler(
  async (req: any, res: any) => {
    try {
      const userId = req.params.userId;
      const productId = req.params.productId;

      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        console.log("Cart not found for user ID:", userId);
        return sendError(res, 404, "Cart not found for the user");
      }

      const initialProductCount = cart.products.length;
      cart.products = cart.products.filter(
        (item) => item.product.toString() !== productId
      );

      if (cart.products.length === initialProductCount) {
        console.log("Product not found in cart:", productId);
        return sendError(res, 404, "Product not found in cart");
      }

      await cart.save();
      return sendSuccess(res, 200, "Product removed from cart successfully", { cart });
    } catch (error) {
      console.error("Error removing product from cart:", error);
      return sendError(res, 500, "Server error");
    }
  }
);
