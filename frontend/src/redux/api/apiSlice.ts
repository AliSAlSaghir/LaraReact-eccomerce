import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  prepareHeaders: headers => {
    headers.set("Accept", "application/json");
    return headers;
  },
});

const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Category"],
  endpoints: () => ({}),
});

export default apiSlice;
