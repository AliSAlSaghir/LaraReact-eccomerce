import { ADMIN_ORDERS_URL, ORDERS_URL } from "../constants";
import { Order, OrderProduct, ShippingAddress } from "../types";
import apiSlice from "./apiSlice";

interface OrderResponse extends Order {
  shipping_address: ShippingAddress | null;
  products: OrderProduct[];
}

const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getOrders: builder.query<Order[], void>({
      query: () => `${ORDERS_URL}`,
      providesTags: ["Order"],
    }),
    createOrder: builder.mutation<OrderResponse, any>({
      query: newOrder => ({
        url: `${ORDERS_URL}`,
        method: "POST",
        body: newOrder,
      }),
      invalidatesTags: ["Order"],
    }),
    getOrder: builder.query<OrderResponse, string>({
      query: id => `${ORDERS_URL}/${id}`,
      providesTags: ["Order"],
    }),
    updateOrder: builder.mutation<
      OrderResponse,
      { updatedOrder: Partial<Order>; id: number }
    >({
      query: ({ updatedOrder, id }) => ({
        url: `${ADMIN_ORDERS_URL}/${id}`,
        method: "POST",
        body: updatedOrder,
      }),
      invalidatesTags: ["Order"],
    }),
    updateOrdersStatus: builder.mutation<
      OrderResponse,
      { status: string; id: number }
    >({
      query: ({ status, id }) => ({
        url: `${ADMIN_ORDERS_URL}/${id}/updateOrdersStatus`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Order"],
    }),
    applyCoupon: builder.mutation<
      OrderResponse,
      { coupon: string; id: number | string }
    >({
      query: ({ coupon, id }) => ({
        url: `${ORDERS_URL}/${id}/applyCoupon`,
        method: "POST",
        body: { coupon },
      }),
      invalidatesTags: ["Order"],
    }),
    deleteOrder: builder.mutation<void, number>({
      query: (id: number) => ({
        url: `${ADMIN_ORDERS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"],
    }),
    getOrderStats: builder.query<any, void>({
      query: () => `${ADMIN_ORDERS_URL}/getOrderStats`,
      providesTags: ["Order"],
    }),
    createStripeSession: builder.mutation<any, number | string>({
      query: (id: number | string) => ({
        url: `${ORDERS_URL}/${id}/createStripeSession`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useCreateOrderMutation,
  useDeleteOrderMutation,
  useGetOrderQuery,
  useUpdateOrderMutation,
  useUpdateOrdersStatusMutation,
  useGetOrderStatsQuery,
  useApplyCouponMutation,
  useCreateStripeSessionMutation,
} = ordersApiSlice;
