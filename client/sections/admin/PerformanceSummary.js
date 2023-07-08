import React from "react";
import { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Widget from "../../components/Widget";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PeopleIcon from "@mui/icons-material/People";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { viewPerformance } from "./GridComponents/ViewPerformance";
import { Box, Grid, Tooltip } from "@mui/material";
import { useDispatch } from "react-redux";
import { commonColumns } from "./GridComponents/ViewDetails";

function PerformanceSummary({ data }) {
  const dispatch = useDispatch();
  const [performanceData, setPerformanceData] = useState("");

  const columns = [
    ...commonColumns,
    {
      field: "view",
      headerName: "View Performance",
      width: 200,
      renderCell: (params) =>
        viewPerformance(params, dispatch, setPerformanceData),
    },
  ];

  return (
    <>
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3} xl={3}>
            <Widget
              title="Todays Earning"
              amount={performanceData?.today_earnings || 0}
              icon={<PeopleIcon />}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3} xl={3}>
            <Widget
              title="Past Week Earning"
              amount={performanceData?.last_week_earnings || 0}
              icon={<GroupAddIcon />}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3} xl={3}>
            <Widget
              title="Last Month Earnings"
              amount={performanceData?.last_month_earnings || 0}
              icon={<RestaurantIcon />}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3} xl={3}>
            <Widget
              title="Bookings this Week"
              amount={performanceData?.bookings_this_month || 0}
              icon={<HourglassEmptyIcon />}
            />
          </Grid>
          <Grid item xs={6}>
            <LineChart
              width={500}
              height={300}
              data={performanceData?.earnings_graph}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="total_bookings"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                name="Bookings Count"
              />
            </LineChart>
          </Grid>
          <Grid item xs={6}>
            <LineChart
              width={500}
              height={300}
              data={performanceData?.earnings_graph}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis></YAxis>
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="total_earnings"
                name="Total Earnings"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ height: 400, width: "100%", my: 3 }}>
        <DataGrid
          autoHeight
          rows={data || []}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          slots={{
            toolbar: GridToolbar,
          }}
          pageSizeOptions={[5]}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          disableRowSelectionOnClick
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
        />
      </Box>
    </>
  );
}

export default PerformanceSummary;
