import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const ZOOM_API = "http://localhost:8080/api/v1/zoom";

export const zoomApi = createApi({
  reducerPath: "zoomApi",
  baseQuery: fetchBaseQuery({
    baseUrl: ZOOM_API,
    credentials: "include", // For cookies/auth
  }),
  endpoints: (builder) => ({
    createZoomMeeting: builder.mutation({
      query: (meetingData) => ({
        url: "/create-meeting",
        method: "POST",
        body: meetingData,
      }),
    }),
    getLiveLectures: builder.query({
      query: () => "/get-live-lectures",
    }),
  }),
});

export const { useCreateZoomMeetingMutation, useGetLiveLecturesQuery } =
  zoomApi;
