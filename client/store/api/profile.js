//
import baseApi from "./base";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query({
      query: () => "/api/users/me",
      providesTags: ["User"],
    }),
    getUserNotification: builder.query({
      query: (id) => `api/restaurant/notifications/${id}/`,
      providesTags: ["User"],
    }),
    updateCurrentUser: builder.mutation({
      query: (data) => ({
        url: "/api/users/me",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deleteBookings: builder.mutation({
      query: (data) => ({
        url: `/api/restaurant/bookings/${data.id}/cancel/`,
        method: "POST",
        body: { role: data.role },
      }),
      invalidatesTags: ["User", "Bookings"],
    }),
    markNotificationsAsRead: builder.mutation({
      query: (id) => `/api/restaurant/notifications/${id}/mark-as-read/`,
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
  useDeleteBookingsMutation,
  useGetUserNotificationQuery,
  useMarkNotificationsAsReadMutation,
} = profileApi;
