import { Button } from "@mui/material";

export const renderButtonCell = (params, handleButtonClick) => {
  const restaurantId = params.row.id;
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => handleButtonClick(restaurantId)}
    >
      View Details
    </Button>
  );
};

export const commonColumns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "name",
    headerName: "Name",
    width: 170,
    editable: true,
  },
  {
    field: "locality",
    headerName: "Locality",
    width: 170,
    editable: true,
  },
  {
    field: "address",
    headerName: "Adress",
    width: 170,
    editable: true,
  },
  {
    field: "city",
    headerName: "City",
    width: 170,
    editable: true,
  },
  {
    field: "phone_number",
    headerName: "Phone",
    width: 170,
    editable: true,
  },
];
