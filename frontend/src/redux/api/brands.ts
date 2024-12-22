import { ADMIN_BRANDS_URL, BRANDS_URL } from "../constants";
import { Brand } from "../types";
import apiSlice from "./apiSlice";

const brandsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getBrands: builder.query<Brand[], void>({
      query: () => `${BRANDS_URL}`,
      providesTags: ["Brand"],
    }),
    addBrand: builder.mutation<Brand, Partial<Brand>>({
      query: newBrand => ({
        url: `${ADMIN_BRANDS_URL}`,
        method: "POST",
        body: newBrand,
      }),
      invalidatesTags: ["Brand"],
    }),
    getBrand: builder.query<Brand, string>({
      query: id => `${BRANDS_URL}/${id}`,
      providesTags: ["Brand"],
    }),
    updateBrand: builder.mutation<
      Brand,
      { updatedBrand: Partial<Brand>; id: number }
    >({
      query: ({ updatedBrand, id }) => ({
        url: `${ADMIN_BRANDS_URL}/${id}`,
        method: "POST",
        body: updatedBrand,
      }),
      invalidatesTags: ["Brand"],
    }),
    deleteBrand: builder.mutation<void, number>({
      query: (id: number) => ({
        url: `${ADMIN_BRANDS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brand"],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useAddBrandMutation,
  useDeleteBrandMutation,
  useGetBrandQuery,
  useUpdateBrandMutation,
} = brandsApiSlice;
