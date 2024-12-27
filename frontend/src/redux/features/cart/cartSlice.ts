import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the CartProduct interface
interface CartProduct {
  id: number;
  quantity: number;
}

// Define the Cart state interface
interface Cart {
  products: CartProduct[];
}

// Initial state
const initialState: Cart = {
  products: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<CartProduct>) => {
      const existingProduct = state.products.find(
        product => product.id === action.payload.id
      );

      if (existingProduct) {
        // Increment quantity if the product already exists
        existingProduct.quantity += action.payload.quantity;
      } else {
        // Add a new product if it doesn't exist
        state.products.push(action.payload);
      }
    },
  },
});

// Export the actions and reducer
export const { addProduct } = cartSlice.actions;
export default cartSlice.reducer;
