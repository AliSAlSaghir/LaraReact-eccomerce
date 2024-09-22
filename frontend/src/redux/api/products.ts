import { PRODUCTS_URL } from "../constants";
import apiSlice from "./apiSlice";

interface Review {
  id: number;
  user_id: number;
  message: string;
  rating: number;
  created_at: string;
}

export interface Product {
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
  average_rating: number;
  brand: string;
  category: string;
  colors: string[];
  sizes: string[];
  reviews: Review[];
}

interface ProductResponse {
  data: Product[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProducts: builder.query<ProductResponse, void>({
      query: () => `${PRODUCTS_URL}`,
      transformResponse: (response: ProductResponse) => response,
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

export const { useGetProductsQuery, useAddProductMutation } = productsApiSlice;
