import { CATEGORIES_URL } from "../constants";
import apiSlice from "./apiSlice";

interface Category {
  id: number;
  name: string;
  user_id: number;
  image: string;
  created_at: string | null;
  updated_at: string | null;
}

const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCategories: builder.query<Category[], void>({
      query: () => `${CATEGORIES_URL}`,
      providesTags: ["Category"],
    }),
    addCategory: builder.mutation<Category, Partial<Category>>({
      query: newCategory => ({
        url: `${CATEGORIES_URL}`,
        method: "POST",
        body: newCategory,
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const { useGetCategoriesQuery } = categoriesApiSlice;
