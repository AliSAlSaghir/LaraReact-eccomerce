import { COLORS_URL } from "../constants";
import { Color } from "../types";
import apiSlice from "./apiSlice";

const colorsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getColors: builder.query<Color[], void>({
      query: () => `${COLORS_URL}`,
    }),
    addColor: builder.mutation<Color, Partial<Color>>({
      query: newColor => ({
        url: `${COLORS_URL}`,
        method: "POST",
        body: newColor,
      }),
    }),
  }),
});

export const { useGetColorsQuery } = colorsApiSlice;
