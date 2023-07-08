import * as React from "react";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/slices/auth";
import Typography from "@mui/material/Typography";
import TablesSummary from "@/sections/restaurant/home/TablesSummary";
import withAuth from "@/utils/withAuth";
import RestaurantLayout from "@/layouts/restaurant";

const Tables = () => {
  const user = useSelector(selectCurrentUser);

  return (
    <RestaurantLayout title="Table Management">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Tables
        </Typography>
      </Box>

      <Box>
        <TablesSummary></TablesSummary>
      </Box>
    </RestaurantLayout>
  );
};

export default withAuth(Tables, [2], "/restaurant/login");
