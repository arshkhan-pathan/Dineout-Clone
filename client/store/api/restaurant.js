//
import baseApi from "./base";

export const restaurantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createRestaurant: builder.mutation({
      query: (credentials) => ({
        url: "/api/restaurant/restaurants/create/ ",
        method: "POST",
        body: credentials,
      }),
    }),
    updateRestaurant: builder.mutation({
      query: ({ data, id }) => ({
        url: `/api/restaurant/restaurants/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["RestaurantData"],
    }),
    getTags: builder.query({
      query: () => "/api/mod/tags",
    }),
    getCuisines: builder.query({
      query: () => "/api/mod/cuisines",
    }),
    getTypes: builder.query({
      query: () => "/api/mod/types",
    }),
    getRestaurantData: builder.query({
      query: (id) => `api/restaurant/restaurants/${id}/`,
    }),
    getRestaurantEarnings: builder.query({
      query: (id) => `api/restaurant/restaurants/${id}/earnings`,
    }),
    getRestaurantBookingStats: builder.query({
      query: (id) => `api/restaurant/restaurants/${id}/bookings/stats`,
    }),
    getRestaurantBookingsData: builder.query({
      query: (id) => `api/restaurant/restaurants/${id}/bookings/data`,
      providesTags: ["Bookings"],
    }),
    getRestaurantById: builder.query({
      query: (id) => `api/restaurant/restaurants/${id}`,
      providesTags: ["RestaurantData"],
    }),
    createTable: builder.mutation({
      query: ({ id, tableData }) => ({
        url: `/api/restaurant/restaurants/${id}/tables/`,
        method: "POST",
        body: tableData,
      }),
      invalidatesTags: ["Tables"],
    }),

    getRestaurantTable: builder.query({
      query: (id) => `/api/restaurant/restaurants/${id}/tables/all`,
      providesTags: ["Tables"],
    }),
    deleteTable: builder.mutation({
      query: ({ id, tableId }) => ({
        url: `/api/restaurant/restaurants/${id}/tables/${tableId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tables"],
    }),

    createPricing: builder.mutation({
      query: ({ id, pricingData }) => ({
        url: `/api/restaurant/restaurants/${id}/pricingrules/`,
        method: "POST",
        body: pricingData,
      }),
      invalidatesTags: ["Rules"],
    }),
    getRestaurantPricings: builder.query({
      query: (id) => `/api/restaurant/restaurants/${id}/pricingrules/all`,
      providesTags: ["Rules"],
    }),

    deleteRule: builder.mutation({
      query: ({ id, ruleId }) => ({
        url: `/api/restaurant/restaurants/${id}/pricingrules/${ruleId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Rules"],
    }),

    getReviews: builder.query({
      query: ({ id, pageNumber, selectedFilters }) =>
        `/api/restaurant/restaurants/${id}/reviews?page=${pageNumber}&ordering=${selectedFilters}`,
    }),
  }),
});

export const {
  useCreateRestaurantMutation,
  useGetTagsQuery,
  useGetCuisinesQuery,
  useGetTypesQuery,
  useGetRestaurantDataQuery,
  useGetRestaurantEarningsQuery,
  useGetRestaurantByIdQuery,
  useCreateTableMutation,
  useGetReviewsQuery,
  useGetRestaurantBookingStatsQuery,
  useGetRestaurantBookingsDataQuery,
  useGetRestaurantTableQuery,
  useDeleteTableMutation,
  useGetRestaurantPricingsQuery,
  useCreatePricingMutation,
  useDeleteRuleMutation,
  useUpdateRestaurantMutation,
} = restaurantApi;
