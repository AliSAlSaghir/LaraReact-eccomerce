import { ADMIN_COLORS_URL, COLORS_URL } from "../constants";
import { Color } from "../types";
import apiSlice from "./apiSlice";

const colorsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getColors: builder.query<Color[], void>({
      query: () => `${COLORS_URL}`,
      providesTags: ["Color"],
    }),
    addColor: builder.mutation<Color, Partial<Color>>({
      query: newColor => ({
        url: `${ADMIN_COLORS_URL}`,
        method: "POST",
        body: newColor,
      }),
      invalidatesTags: ["Color"],
    }),
    getColor: builder.query<Color, string>({
      query: id => `${COLORS_URL}/${id}`,
      providesTags: ["Color"],
    }),
    updateColor: builder.mutation<
      Color,
      { updatedColor: Partial<Color>; id: number }
    >({
      query: ({ updatedColor, id }) => ({
        url: `${ADMIN_COLORS_URL}/${id}`,
        method: "POST",
        body: updatedColor,
      }),
      invalidatesTags: ["Color"],
    }),
    deleteColor: builder.mutation<void, number>({
      query: (id: number) => ({
        url: `${ADMIN_COLORS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Color"],
    }),
  }),
});

export const {
  useGetColorsQuery,
  useAddColorMutation,
  useDeleteColorMutation,
  useGetColorQuery,
  useUpdateColorMutation,
} = colorsApiSlice;
