import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../types";

// Define the CartProduct interface
interface CartProduct {
  id: number | string;
  quantity: number;
  color: string;
  size: string;
  product: Product;
}

// Define the Cart state interface
interface Cart {
  products: CartProduct[];
}

// Load cart from localStorage
const loadCartFromLocalStorage = (): Cart => {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    return JSON.parse(savedCart);
  }
  return { products: [] }; // Return empty cart if no data is found
};

// Save cart to localStorage
const saveCartToLocalStorage = (cart: Cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Initial state, loading from localStorage
const initialState: Cart = loadCartFromLocalStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add or update a product in the cart
    addProductToCart: (state, action: PayloadAction<CartProduct>) => {
      const existingProduct = state.products.find(
        product =>
          product.id === action.payload.id &&
          product.color === action.payload.color &&
          product.size === action.payload.size
      );

      if (existingProduct) {
        existingProduct.quantity += action.payload.quantity;
      } else {
        state.products.push(action.payload);
      }

      // Save the updated cart to localStorage
      saveCartToLocalStorage(state);
    },

    // Update the quantity of a product
    updateProductQuantity: (
      state,
      action: PayloadAction<{
        id: number | string;
        color: string;
        size: string;
        quantity: number;
      }>
    ) => {
      const product = state.products.find(
        p =>
          p.id === action.payload.id &&
          p.color === action.payload.color &&
          p.size === action.payload.size
      );

      if (product) {
        product.quantity = action.payload.quantity;
        if (product.quantity <= 0) {
          // Remove the product if the quantity is 0 or less
          state.products = state.products.filter(
            p =>
              !(
                p.id === action.payload.id &&
                p.color === action.payload.color &&
                p.size === action.payload.size
              )
          );
        }
      }

      // Save the updated cart to localStorage
      saveCartToLocalStorage(state);
    },

    // Remove a product from the cart
    removeProductFromCart: (
      state,
      action: PayloadAction<{
        id: number | string;
        color: string;
        size: string;
      }>
    ) => {
      state.products = state.products.filter(
        product =>
          !(
            product.id === action.payload.id &&
            product.color === action.payload.color &&
            product.size === action.payload.size
          )
      );

      // Save the updated cart to localStorage
      saveCartToLocalStorage(state);
    },

    // Clear the entire cart
    clearCart: state => {
      state.products = [];

      // Remove the cart from localStorage
      localStorage.removeItem("cart");
    },

    // Set or replace all products in the cart
    setCartProducts: (state, action: PayloadAction<CartProduct[]>) => {
      state.products = action.payload;

      // Save the updated cart to localStorage
      saveCartToLocalStorage(state);
    },
  },
});

// Export the actions and reducer
export const {
  addProductToCart,
  updateProductQuantity,
  removeProductFromCart,
  clearCart,
  setCartProducts,
} = cartSlice.actions;
export default cartSlice.reducer;
