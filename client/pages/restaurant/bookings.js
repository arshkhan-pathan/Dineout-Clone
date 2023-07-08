import * as React from "react";
import Box from "@mui/material/Box";
import withAuth from "@/utils/withAuth";
import Typography from "@mui/material/Typography";
import BookingSummary from "@/sections/restaurant/home/BookingSummary";
import RestaurantLayout from "@/layouts/restaurant";

const Bookings = () => {
  return (
    <RestaurantLayout title="Bookings">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Bookings
        </Typography>
      </Box>
      <Box>
        <BookingSummary />
      </Box>
    </RestaurantLayout>
  );
};

export default withAuth(Bookings, [2], "/restaurant/login");
