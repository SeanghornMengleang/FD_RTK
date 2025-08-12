import { apiSlice } from "../api/apiSlice";
import { useParams } from "react-router";
import React, { useState } from "react";
import { da } from "zod/locales";

// Product API endpoints using RTK Query
const productApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // Get all products
    getProducts: build.query({
      query: () => ({
        url: "/products",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Products", id })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),

    // Get product by ID
    getProductById: build.query({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),
    /*
    // Create new product
    createProduct: build.mutation({
      query: (product) => ({
        url: "/products/",
        method: "POST",
        body: {
          title: product.title,
          description: product.description,
          price: product.price,
          categoryId: product.categoryId,
          images: product.images,
          slug: product.slug,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      // Invalidate products cache after creation
      invalidatesTags: (result, error, product) => [
        { type: "Products", id: "LIST" },
      ],
      // Optimistically update the cache
      async onQueryStarted(product, { dispatch, queryFulfilled }) {
        try {
          const { data: newProduct } = await queryFulfilled;
          console.log("Product created successfully:", newProduct);

          // Manually update the cache to show new product immediately
          dispatch(
            productApi.util.updateQueryData(
              "getProducts",
              undefined,
              (draft) => {
                draft.unshift(newProduct);
              }
            )
          );
        } catch (error) {
          console.error("Failed to create product:", error);
        }
      },
    }),

    // Get all categories
    getCategories: build.query({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
      providesTags: ["Categories"],
    }),
    */
  }),
});

// Export hooks for use in components
export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useGetCategoriesQuery,
} = productApi;
