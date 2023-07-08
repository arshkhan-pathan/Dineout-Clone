//
import baseApi from "./base";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/api/login/",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: "/api/register/",
        method: "POST",
        body: { ...credentials },
      }),
    }),

    restaurantRegister: builder.mutation({
      query: (credentials) => ({
        url: "/api/managers/register/",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    restaurantLogin: builder.mutation({
      query: (credentials) => ({
        url: "/api/managers/login/",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: "/api/admin/login",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/api/change-password/",
        method: "PUT",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/users/reset_password_confirm/",
        method: "POST",
        body: data,
      }),
    }),
    googleLogin: builder.mutation({
      query: (credentials) => ({
        url: "/api/social/google/",
        method: "POST",
        body: { ...credentials },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRestaurantRegisterMutation,
  useRestaurantLoginMutation,
  useAdminLoginMutation,
  useChangePasswordMutation,
  useResetPasswordMutation,
  useRegisterMutation,
  useGoogleLoginMutation,
} = authApi;
