import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../../common/constants";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    // prepareHeaders: (headers, { getState }) => {},
  }),
  endpoints: (builder) => ({
    getUserDetails: builder.query({
      query: () => ({
        url: "api/users/me",
        method: "GET",
      }),
    }),
  }),
});
export const { useGetUserDetailsQuery } = authApi;
