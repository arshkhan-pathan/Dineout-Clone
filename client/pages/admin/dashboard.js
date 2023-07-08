import React from "react";
import AdminLayout from "@/layouts/admin";
import { Box, Typography } from "@mui/material";
import DashboardSummary from "@/sections/admin/DashboardSummary";
import { useGetStatsQuery } from "@/store/api/admin";
import withAuth from "@/utils/withAuth";
import Loading from "@/components/Loading";

function Dashboard() {
  const { data, isLoading } = useGetStatsQuery();
  return (
    <>
      <AdminLayout title="Dashboard">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Hello Admin
          </Typography>
        </Box>

        {isLoading ? (
          <Loading></Loading>
        ) : (
          <Box>
            <DashboardSummary data={data}></DashboardSummary>
          </Box>
        )}
      </AdminLayout>
    </>
  );
}

export default withAuth(Dashboard, ["1"], "/admin");
