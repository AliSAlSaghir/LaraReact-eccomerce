import { BASE_URL } from "../constants";
import { ShippingAddress } from "../types";
import apiSlice from "./apiSlice";

const shippingAddressApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createShippingAddress: builder.mutation<
      ShippingAddress,
      Partial<ShippingAddress>
    >({
      query: newShippingAddress => ({
        url: `${BASE_URL}/api/createShippingAddress`,
        method: "POST",
        body: newShippingAddress,
      }),
    }),
  }),
});

export const { useCreateShippingAddressMutation } = shippingAddressApiSlice;
