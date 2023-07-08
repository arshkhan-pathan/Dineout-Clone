import React from "react";
import AdminLayout from "@/layouts/admin";
import FeaturedSummary from "@/sections/admin/FeaturedSummary";
import { Box, Typography } from "@mui/material";
import {
  useAllRestaurantsQuery,
  useFeaturedRestaurantsQuery,
  useRestaurantStatsQuery,
} from "@/store/api/admin";
import withAuth from "@/utils/withAuth";
import Loading from "@/components/Loading";

function Featured() {
  const { data, isLoading: featLoading } = useFeaturedRestaurantsQuery("", {
    refetchOnMountOrArgChange: true,
  });

  const { data: allRestaurants, isLoading: restLoading } =
    useAllRestaurantsQuery("", {
      refetchOnMountOrArgChange: true,
    });

  const { data: stats, isLoading: statsLoadings } = useRestaurantStatsQuery(
    "",
    {
      refetchOnMountOrArgChange: true,
    }
  );
  //
  return (
    <AdminLayout title="Featured Restaurant">
      <Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Featured
        </Typography>

        {featLoading && restLoading && statsLoadings ? (
          <Loading></Loading>
        ) : (
          <FeaturedSummary
            data={data}
            allRestaurants={allRestaurants}
            stats={stats}
          />
        )}
      </Box>
    </AdminLayout>
  );
}

export default withAuth(Featured, ["1"], "/admin");
