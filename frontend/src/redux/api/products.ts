import { ADMIN_PRODUCTS_URL, PRODUCTS_URL } from "../constants";
import { Product } from "../types";
import apiSlice from "./apiSlice";

interface ProductsResponse {
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

interface ProductResponse {
  data: Product;
}

const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProducts: builder.query<ProductsResponse, string>({
      query: query => `${PRODUCTS_URL}${query}`,
      transformResponse: (response: ProductsResponse) => response,
    }),
    getProduct: builder.query<ProductResponse, string>({
      query: id => `${PRODUCTS_URL}/${id}`,
    }),
    addProduct: builder.mutation<Product, Partial<Product>>({
      query: newProduct => ({
        url: `${ADMIN_PRODUCTS_URL}`,
        method: "POST",
        body: newProduct,
      }),
    }),
    updateProduct: builder.mutation<
      Product,
      { updatedProduct: Partial<Product>; id: string }
    >({
      query: ({ updatedProduct, id }) => ({
        url: `${ADMIN_PRODUCTS_URL}/${id}`,
        method: "POST",
        body: updatedProduct,
      }),
    }),
    deleteProduct: builder.mutation<void, number>({
      query: (id: number) => ({
        url: `${ADMIN_PRODUCTS_URL}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useLazyGetProductsQuery,
  useGetProductsQuery,
  useGetProductQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApiSlice;
