import React from "react";
import AdminLayout from "@/layouts/admin";
import { Box, Typography } from "@mui/material";
import PendingSummary from "@/sections/admin/PendingSummary";
import {
  useGetPendingRestaurantsQuery,
  useRequestStatsQuery,
} from "@/store/api/admin";
import withAuth from "@/utils/withAuth";
import Loading from "@/components/Loading";

function Requests() {
  const { data, isLoading: pendingLoading } = useGetPendingRestaurantsQuery(
    "arsh",
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: stats, isLoading: statsLoading } = useRequestStatsQuery();

  return (
    <AdminLayout title="Pending Requests">
      <Box>
        <Typography variant="h5" sx={{ fontWeight: "bold" }} gutterBottom>
          Pending Restaurants
        </Typography>
        {pendingLoading && statsLoading ? (
          <Loading></Loading>
        ) : (
          <PendingSummary data={data} stats={stats}></PendingSummary>
        )}
      </Box>
    </AdminLayout>
  );
}

export default withAuth(Requests, ["1"], "/admin");
