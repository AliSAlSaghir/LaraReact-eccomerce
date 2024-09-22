import { PRODUCTS_URL } from "../constants";
import apiSlice from "./apiSlice";

interface Review {
  id: number;
  user_id: number;
  message: string;
  rating: number;
  created_at: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  brand_id: number;
  category_id: number;
  user_id: number;
  images: string[];
  price: string;
  quantity: number;
  total_sold: number;
  total_qty: number;
  total_reviews: number;
  average_rating: string;
  colors: string[];
  sizes: string[];
  reviews: Review[];
}

const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProducts: builder.query<Product[], void>({
      query: () => `${PRODUCTS_URL}`,
    }),
    addProduct: builder.mutation<Product, Partial<Product>>({
      query: newProduct => ({
        url: `${PRODUCTS_URL}`,
        method: "POST",
        body: newProduct,
      }),
    }),
  }),
});

export const { useGetProductsQuery } = productsApiSlice;
