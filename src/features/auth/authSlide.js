import { apiSlice } from "../api/apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (body) => ({
        url: `/auth/login`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body, // shorthand for body: body
      }),
    }),
    register: build.mutation({
      query: (body) => ({
        url: `/users/user-signup?emailVerified=false`, // fixed endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body:body,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
