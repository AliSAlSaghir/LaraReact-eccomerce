import { ADMIN_ORDERS_URL, ORDERS_URL } from "../constants";
import { Order, OrderProduct, ShippingAddress } from "../types";
import apiSlice from "./apiSlice";

interface OrderResponse extends Order {
  shipping_address: ShippingAddress;
  products: OrderProduct[];
}

const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getOrders: builder.query<Order[], void>({
      query: () => `${ORDERS_URL}`,
      providesTags: ["Order"],
    }),
    addOrder: builder.mutation<OrderResponse, Partial<Order>>({
      query: newOrder => ({
        url: `${ADMIN_ORDERS_URL}`,
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
    deleteOrder: builder.mutation<void, number>({
      query: (id: number) => ({
        url: `${ADMIN_ORDERS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useAddOrderMutation,
  useDeleteOrderMutation,
  useGetOrderQuery,
  useUpdateOrderMutation,
  useUpdateOrdersStatusMutation,
} = ordersApiSlice;
