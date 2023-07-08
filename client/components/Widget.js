// @mui
import { styled } from "@mui/material/styles";
import { Card, Typography } from "@mui/material";

const StyledIcon = styled("div")(({ theme }) => ({
  margin: "auto",
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  width: theme.spacing(8),
  height: theme.spacing(0),
  justifyContent: "center",
  marginBottom: theme.spacing(3),
}));

export default function AppWidgetSummary({ sx, title, amount, icon }) {
  return (
    <Card
      sx={{
        py: 5,
        boxShadow: 0,
        textAlign: "center",
        color: (theme) => theme.palette.primary.main,
        bgcolor: "#ffe6e6",
        ...sx,
      }}
    >
      <StyledIcon sx={{ fontSize: "20px" }}>{icon}</StyledIcon>

      <Typography variant="h3" gutterBottom>
        {amount}
      </Typography>

      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        {title}
      </Typography>
    </Card>
  );
}
