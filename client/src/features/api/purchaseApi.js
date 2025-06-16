import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const PURCHASE_API =
  process.env.REACT_APP_PURCHASE_API || "http://localhost:5000/api/v1/purchase";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: PURCHASE_API,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      let token = getState().auth?.token;
      if (!token) {
        token = localStorage.getItem("token");
        console.log("purchaseApi: Using token from localStorage:", token);
      }
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        console.log(
          "purchaseApi: Authorization header set:",
          `Bearer ${token}`
        );
      } else {
        console.warn("purchaseApi: No token found for Purchase API request!");
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Purchase"],
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (courseId) => ({
        url: "/checkout/create-checkout-session",
        method: "POST",
        body: { courseId },
      }),
      invalidatesTags: ["User", "Purchase"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("createCheckoutSession error:", error);
          if (error?.error?.status === 401) {
            console.log(
              "createCheckoutSession: Unauthorized, dispatching logout"
            );
            localStorage.removeItem("token");
            dispatch({ type: "auth/logout" }); // Assuming this action exists in authSlice
          }
        }
      },
    }),
    getCourseDetailWithStatus: builder.query({
      query: (courseId) => ({
        url: `/course/${courseId}/detail-with-status`,
        method: "GET",
      }),
      providesTags: ["Purchase"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("getCourseDetailWithStatus error:", error);
          if (error?.error?.status === 401) {
            console.log(
              "getCourseDetailWithStatus: Unauthorized, dispatching logout"
            );
            localStorage.removeItem("token");
            dispatch({ type: "auth/logout" });
          }
        }
      },
    }),
    getPurchasedCourses: builder.query({
      query: () => ({
        url: `/`,
        method: "GET",
      }),
      providesTags: ["Purchase"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("getPurchasedCourses error:", error);
          if (error?.error?.status === 401) {
            console.log(
              "getPurchasedCourses: Unauthorized, dispatching logout"
            );
            localStorage.removeItem("token");
            dispatch({ type: "auth/logout" });
          }
        }
      },
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useGetCourseDetailWithStatusQuery,
  useGetPurchasedCoursesQuery,
} = purchaseApi;
