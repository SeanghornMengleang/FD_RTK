import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// API Configuration
const API_BASE_URL = import.meta.env.VITE_BASE_URL || "https://api.escuelajs.co/api/v1";

// Debug environment variable in development
if (import.meta.env.DEV) {
  console.log("API Base URL:", API_BASE_URL);
 
}

// Define the main API slice
export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_BASE_URL
  }),
  endpoints: (build) => ({})
});
