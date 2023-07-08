import { Grid, Box } from "@mui/material";
import Widget from "../../components/Widget";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PeopleIcon from "@mui/icons-material/People";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

const DashboardSummary = ({ data }) => {
  return (
    <>
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3} xl={3}>
            <Widget
              title="New Users This Week"
              amount={data?.new_users_count}
              icon={<PeopleIcon />}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3} xl={3}>
            <Widget
              title="Total Users Registered"
              amount={data?.total_users_count}
              icon={<GroupAddIcon />}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3} xl={3}>
            <Widget
              title="Total Restaurants"
              amount={data?.verified_restaurants_count}
              icon={<RestaurantIcon />}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3} xl={3}>
            <Widget
              title="Pending Restarurant"
              amount={data?.unverified_restaurants_count}
              icon={<HourglassEmptyIcon />}
            />
          </Grid>
          <Grid item xs={6}>
            <LineChart
              width={500}
              height={300}
              data={data?.bookings_graph_data}
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
                dataKey="count"
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
              data={data?.new_users_graph_data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date_joined__date" />
              <YAxis></YAxis>
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                name="User Count"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default DashboardSummary;
