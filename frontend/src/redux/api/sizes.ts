import { SIZES_URL } from "../constants";
import { Size } from "../types";
import apiSlice from "./apiSlice";

const sizesApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getSizes: builder.query<Size[], void>({
      query: () => `${SIZES_URL}`,
    }),
    addSize: builder.mutation<Size, Partial<Size>>({
      query: newSize => ({
        url: `${SIZES_URL}`,
        method: "POST",
        body: newSize,
      }),
    }),
  }),
});

export const { useGetSizesQuery } = sizesApiSlice;
