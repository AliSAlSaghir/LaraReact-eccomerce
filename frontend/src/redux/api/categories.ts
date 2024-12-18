import { CATEGORIES_URL } from "../constants";
import { Category } from "../types";
import apiSlice from "./apiSlice";

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
