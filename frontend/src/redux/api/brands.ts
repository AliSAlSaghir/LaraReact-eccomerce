import { BRANDS_URL } from "../constants";
import { Brand } from "../types";
import apiSlice from "./apiSlice";

const brandsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getBrands: builder.query<Brand[], void>({
      query: () => `${BRANDS_URL}`,
    }),
    addBrand: builder.mutation<Brand, Partial<Brand>>({
      query: newBrand => ({
        url: `${BRANDS_URL}`,
        method: "POST",
        body: newBrand,
      }),
    }),
  }),
});

export const { useGetBrandsQuery } = brandsApiSlice;
