import { ADMIN_CATEGORIES_URL, CATEGORIES_URL } from "../constants";
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
        url: `${ADMIN_CATEGORIES_URL}`,
        method: "POST",
        body: newCategory,
      }),
      invalidatesTags: ["Category"],
    }),
    getCategory: builder.query<Category, string>({
      query: id => `${CATEGORIES_URL}/${id}`,
      providesTags: ["Category"],
    }),
    updateCategory: builder.mutation<
      Category,
      { updatedCategory: Partial<Category>; id: number }
    >({
      query: ({ updatedCategory, id }) => ({
        url: `${ADMIN_CATEGORIES_URL}/${id}`,
        method: "POST",
        body: updatedCategory,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation<void, number>({
      query: (id: number) => ({
        url: `${ADMIN_CATEGORIES_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
} = categoriesApiSlice;
