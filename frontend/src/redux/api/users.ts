import { USERS_URL } from "../constants";
import apiSlice from "./apiSlice";

const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUsers: builder.query<any, void>({
      query: () => `${USERS_URL}`,
    }),
  }),
});

export const { useGetUsersQuery } = usersApiSlice;
