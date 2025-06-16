import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BATCH_API = "http://localhost:8080/api/v1/batches";

export const batchApi = createApi({
  reducerPath: "batchApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BATCH_API,
    credentials: "include", // ✅ Ensures cookies are sent
  }),
  endpoints: (builder) => ({
    createBatch: builder.mutation({
      query: (batchData) => ({
        url: "/create",
        method: "POST",
        body: batchData,
      }),
    }),
  }),
});

export const { useCreateBatchMutation } = batchApi;
