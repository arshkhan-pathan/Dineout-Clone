import React from "react";
import { Box, Grid } from "@mui/material";
import Widget from "../../components/Widget";
import TodayIcon from "@mui/icons-material/Today";
import UpcomingIcon from "@mui/icons-material/Upcoming";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { Button } from "@mui/material";
import { removeFeatured } from "./GridComponents/RemovePending";
import {
  useApprovePendingRestaurantMutation,
  useDeletePendingRestaurantMutation,
} from "@/store/api/admin";
import { approveTable } from "./GridComponents/ApproveFeatured";
import DataModals from "./GridComponents/DataModals";
import { commonColumns } from "./GridComponents/ViewDetails";

function PendingSummary({ data, stats }) {
  const [approvePendingRestaurant] = useApprovePendingRestaurantMutation();
  const [deletePendingRestaurant] = useDeletePendingRestaurantMutation();
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = (restaurantId) => {
    setSelectedRestaurantId(restaurantId);
    setIsModalOpen(true);
  };

  const renderButtonCell = (params) => {
    const restaurantId = params.row.id;
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleButtonClick(restaurantId)}
      >
        Details
      </Button>
    );
  };
  const columns = [
    ...commonColumns,
    {
      field: "actionss",
      headerName: "Details",
      width: 120,
      renderCell: renderButtonCell,
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 120,
      renderCell: (params) => removeFeatured(params, deletePendingRestaurant),
    },
    {
      field: "actions",
      headerName: "Approve",
      width: 120,
      renderCell: (params) => approveTable(params, approvePendingRestaurant),
    },
  ];
  return (
    <>
      <Box>
        <Grid container spacing={5}>
          <Grid item xs={12} md={6} lg={4} xl={4}>
            <Widget
              title={"Total Pending Restaurants"}
              amount={stats?.total_pending_restaurants}
              icon={<TodayIcon />}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4} xl={4}>
            <Widget
              title={"New Restaurants Request"}
              amount={stats?.new_restaurants_today}
              icon={<UpcomingIcon />}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4} xl={4}>
            <Widget
              title={"Total Verified Restaurants"}
              amount={stats?.total_verified_restaurants}
              icon={<CalendarMonthIcon />}
            />
          </Grid>
        </Grid>

        <Box sx={{ height: 400, width: "100%", mt: 3 }}>
          <DataGrid
            rows={data || []}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
          />
        </Box>
        <DataModals
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          selectedRestaurantId={selectedRestaurantId}
          data={data}
        ></DataModals>
      </Box>
    </>
  );
}

export default PendingSummary;
