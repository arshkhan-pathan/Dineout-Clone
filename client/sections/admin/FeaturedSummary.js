import React from "react";
import Widget from "../../components/Widget";
import { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Grid, Typography } from "@mui/material";
import DataModals from "./GridComponents/DataModals";
import StorefrontIcon from "@mui/icons-material/Storefront";
import StarIcon from "@mui/icons-material/Star";
import {
  useApproveFeaturedRestaurantMutation,
  useDeleteFeaturedRestaurantMutation,
} from "@/store/api/admin";
import { renderButtonCell } from "./GridComponents/ViewDetails";
import { removeFeatured } from "./GridComponents/RemoveFeatured";
import { approveTable } from "./GridComponents/ApproveFeatured";
import { commonColumns } from "./GridComponents/ViewDetails";

function FeaturedSummary({ data, allRestaurants, stats }) {
  const [deleteFeaturedRestaurant] = useDeleteFeaturedRestaurantMutation();
  const [approveFeaturedRestaurant] = useApproveFeaturedRestaurantMutation();
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = (restaurantId) => {
    setSelectedRestaurantId(restaurantId);
    setIsModalOpen(true);
  };

  const columnsFeatured = [
    ...commonColumns,
    {
      field: "actionss",
      headerName: "Details",
      width: 150,
      renderCell: (params) => renderButtonCell(params, handleButtonClick),
    },
    {
      field: "Delete",
      headerName: "Delete",
      width: 150,
      renderCell: (params) => removeFeatured(params, deleteFeaturedRestaurant),
    },
  ];

  const columnsRestaurant = [
    ...commonColumns,
    {
      field: "actionss",
      headerName: "Details",
      width: 150,
      renderCell: (params) => renderButtonCell(params, handleButtonClick),
    },
    {
      field: "Add",
      headerName: "Add",
      width: 150,
      renderCell: (params) => approveTable(params, approveFeaturedRestaurant),
    },
  ];
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3} xl={3}>
          <Widget
            title="Total Restaurants"
            amount={stats?.total_restaurants}
            icon={<StorefrontIcon />}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3} xl={3}>
          <Widget
            title="Total Featured Restaurants"
            amount={stats?.total_featured}
            icon={<StarIcon />}
          />
        </Grid>
      </Grid>
      <Box sx={{ height: 400, width: "100%", my: 3 }}>
        <DataGrid
          autoHeight
          rows={data || []}
          columns={columnsFeatured}
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
        data={allRestaurants}
      ></DataModals>

      <Box sx={{ height: 200, width: "100%" }}>
        <Typography gutterBottom fontWeight="bold">
          All Restaurants
        </Typography>
        <DataGrid
          autoHeight
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          rows={allRestaurants || []}
          columns={columnsRestaurant}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
}

export default FeaturedSummary;
