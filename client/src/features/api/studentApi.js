import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const STUDENT_API =
  process.env.REACT_APP_STUDENT_API ||
  "https://lms-c3nt.onrender.com/api/v1/students";

export const studentApi = createApi({
  reducerPath: "studentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: STUDENT_API,
    credentials: "include", // Use cookies for authentication
  }),
  tagTypes: ["Student"],
  endpoints: (builder) => ({
    getAllStudents: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),
      providesTags: ["Student"],
    }),
    addStudent: builder.mutation({
      query: (studentData) => ({
        url: "/add-student",
        method: "POST",
        body: studentData,
      }),
      invalidatesTags: ["Student"],
    }),
    updateStudent: builder.mutation({
      query: ({ id, ...studentData }) => ({
        url: `/${id}`,
        method: "PUT",
        body: studentData,
      }),
      invalidatesTags: ["Student"],
    }),
    deleteStudent: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Student"],
    }),
    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: "/change-password",
        method: "POST",
        body: passwordData,
      }),
    }),
  }),
});

export const {
  useGetAllStudentsQuery,
  useAddStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useChangePasswordMutation,
} = studentApi;
