import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setLoading, setError, logout, setUser, setToken } from "../authSlice";

const USER_API =
  process.env.REACT_APP_USER_API ||
  "https://lms-c3nt.onrender.com/api/v1/user/";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      let token = getState().auth?.token;
      if (!token) {
        token = localStorage.getItem("token");
        console.log("authApi: Using token from localStorage:", token);
      }
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        console.log("authApi: Authorization header set:", `Bearer ${token}`);
      } else {
        console.warn("authApi: No token found for Auth API request!");
      }
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (inputData) => ({
        url: "register",
        method: "POST",
        body: inputData,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          console.log("registerUser response:", data);
        } catch (error) {
          console.error("registerUser error:", error);
          dispatch(
            setError(error.error?.data?.message || "Registration failed")
          );
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),
    loginUser: builder.mutation({
      query: (inputData) => ({
        url: "login",
        method: "POST",
        body: inputData,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          console.log("loginUser response:", data);
          localStorage.setItem("token", data.token);
          dispatch(setToken(data.token));
          dispatch(setUser(data.user));
        } catch (error) {
          console.error("loginUser error:", error);
          dispatch(setError(error.error?.data?.message || "Login failed"));
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "logout",
        method: "GET",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          localStorage.removeItem("token");
          dispatch(logout());
        } catch (error) {
          dispatch(setError(error.error?.data?.message || "Logout failed"));
        }
      },
    }),
    loadUser: builder.query({
      query: () => ({
        url: "profile",
        method: "GET",
      }),
      providesTags: ["User"],
      pollingInterval: 0,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true));
          const { data } = await queryFulfilled;
          console.log("loadUser response:", data);
          if (data.token) {
            localStorage.setItem("token", data.token);
            dispatch(setToken(data.token));
          }
          dispatch(
            setUser({
              ...data.user,
              forcePasswordChange: data.user.forcePasswordChange,
            })
          );
        } catch (error) {
          console.error("loadUser error:", error);
          if (error?.error?.status === 401) {
            console.log("loadUser: Unauthorized, dispatching logout");
            localStorage.removeItem("token");
            dispatch(logout());
          } else {
            dispatch(
              setError(error.error?.data?.message || "Failed to load user")
            );
          }
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),
    updateUser: builder.mutation({
      query: (formData) => ({
        url: "profile/update",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("updateUser error:", error);
          if (error?.error?.status === 401) {
            console.log("updateUser: Unauthorized, dispatching logout");
            localStorage.removeItem("token");
            dispatch(logout());
          }
        }
      },
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useLoadUserQuery,
  useUpdateUserMutation,
} = authApi;
