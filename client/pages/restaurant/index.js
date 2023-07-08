import withAuth from "@/utils/withAuth";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { selectCurrentUser } from "@/store/slices/auth";
import { useSelector } from "react-redux";
import {
  useGetRestaurantBookingStatsQuery,
  useGetRestaurantEarningsQuery,
} from "@/store/api/restaurant";
import Summary from "@/sections/restaurant/home/Summary";
import RestaurantLayout from "@/layouts/restaurant";
import Loading from "@/components/Loading";

const Restaurant = ({}) => {
  const user = useSelector(selectCurrentUser);

  const { data, isLoading } = useGetRestaurantEarningsQuery(user.id, {
    refetchOnMountOrArgChange: true,
  });

  const { data: stats, isLoading: statsLoading } =
    useGetRestaurantBookingStatsQuery(user.id, {
      refetchOnMountOrArgChange: true,
    });

  return (
    <RestaurantLayout title="Dashboard Home">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Hello {user?.first_name}
        </Typography>
      </Box>
      {isLoading && statsLoading ? (
        <Loading></Loading>
      ) : (
        <Box>
          <Summary data={data} stats={stats} graph={data?.graph} />
        </Box>
      )}
    </RestaurantLayout>
  );
};

export default withAuth(Restaurant, [2], "/restaurant/login");
