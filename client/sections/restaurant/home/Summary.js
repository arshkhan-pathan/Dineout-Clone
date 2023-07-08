import { Grid, Box } from "@mui/material";
import Widget from "../../../components/Widget";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import TodayIcon from "@mui/icons-material/Today";
import UpcomingIcon from "@mui/icons-material/Upcoming";

const Summary = ({ data, stats, graph }) => {
  return (
    <>
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3} xl={3}>
            <Widget
              title="Todays Earning"
              amount={data?.today || 0}
              icon={<AttachMoneyIcon />}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3} xl={3}>
            <Widget
              title="Week Earning"
              amount={data?.last_week || 0}
              icon={<ViewWeekIcon />}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3} xl={3}>
            <Widget
              title="Todays Booking"
              amount={stats?.today_bookings || 0}
              icon={<TodayIcon />}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3} xl={3}>
            <Widget
              title="Upcoming Bookings"
              amount={stats?.upcoming_bookings || 0}
              icon={<UpcomingIcon />}
            />
          </Grid>
          <Grid item xs={6}>
            <LineChart
              width={500}
              height={300}
              data={graph}
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
                dataKey="total_earnings"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </Grid>
          <Grid item xs={6}>
            <LineChart
              width={500}
              height={300}
              data={graph}
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
              />
            </LineChart>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Summary;
