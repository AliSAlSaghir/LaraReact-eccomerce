import { ADMIN_SIZES_URL, SIZES_URL } from "../constants";
import { Size } from "../types";
import apiSlice from "./apiSlice";

const sizesApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getSizes: builder.query<Size[], void>({
      query: () => `${SIZES_URL}`,
      providesTags: ["Size"],
    }),
    addSize: builder.mutation<Size, Partial<Size>>({
      query: newSize => ({
        url: `${ADMIN_SIZES_URL}`,
        method: "POST",
        body: newSize,
      }),
      invalidatesTags: ["Size"],
    }),
    getSize: builder.query<Size, string>({
      query: id => `${SIZES_URL}/${id}`,
      providesTags: ["Size"],
    }),
    updateSize: builder.mutation<
      Size,
      { updatedSize: Partial<Size>; id: number }
    >({
      query: ({ updatedSize, id }) => ({
        url: `${ADMIN_SIZES_URL}/${id}`,
        method: "POST",
        body: updatedSize,
      }),
      invalidatesTags: ["Size"],
    }),
    deleteSize: builder.mutation<void, number>({
      query: (id: number) => ({
        url: `${ADMIN_SIZES_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Size"],
    }),
  }),
});

export const {
  useGetSizesQuery,
  useAddSizeMutation,
  useDeleteSizeMutation,
  useGetSizeQuery,
  useUpdateSizeMutation,
} = sizesApiSlice;
