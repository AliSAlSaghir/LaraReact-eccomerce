import { ADMIN_COUPONS_URL, COUPONS_URL } from "../constants";
import { Coupon } from "../types";
import apiSlice from "./apiSlice";

const couponsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCoupons: builder.query<Coupon[], void>({
      query: () => `${COUPONS_URL}`,
      providesTags: ["Coupon"],
    }),
    getCoupon: builder.query<Coupon, string>({
      query: id => `${COUPONS_URL}/${id}`,
      providesTags: ["Coupon"],
    }),
    addCoupon: builder.mutation<Coupon, Partial<Coupon>>({
      query: newCoupon => ({
        url: `${ADMIN_COUPONS_URL}`,
        method: "POST",
        body: newCoupon,
      }),
      invalidatesTags: ["Coupon"],
    }),
    updateCoupon: builder.mutation<
      Coupon,
      { updatedCoupon: Partial<Coupon>; id: string }
    >({
      query: ({ updatedCoupon, id }) => ({
        url: `${ADMIN_COUPONS_URL}/${id}`,
        method: "POST",
        body: updatedCoupon,
      }),
      invalidatesTags: ["Coupon"],
    }),
    deleteCoupon: builder.mutation<void, number>({
      query: (id: number) => ({
        url: `${ADMIN_COUPONS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coupon"],
    }),
  }),
});

export const {
  useGetCouponsQuery,
  useGetCouponQuery,
  useAddCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponsApiSlice;
