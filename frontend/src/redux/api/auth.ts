import { AUTH_URL } from "../constants";
import { User } from "../types";
import apiSlice from "./apiSlice";

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LogoutResponse {
  message: string;
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    register: builder.mutation<User, RegisterRequest>({
      query: formData => ({
        url: `${AUTH_URL}/register`,
        method: "POST",
        body: formData,
      }),
    }),
    login: builder.mutation<User, LoginRequest>({
      query: formData => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        body: formData,
      }),
    }),
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: "POST",
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useLogoutMutation } =
  authApiSlice;
