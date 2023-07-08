import React from "react";
import { DataGrid } from "@mui/x-data-grid";

function BookingsGrid({ rows, columns }) {
  return (
    <>
      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
        sx={{ background: "white" }}
        density="comfortable"
      />
    </>
  );
}

export default BookingsGrid;
export const commonColumns = [
  { field: "id", headerName: "ID", width: 90 },

  {
    field: "restaurant_name",
    headerName: "Restaurant Name",
    width: 150,
    editable: false,
  },

  {
    field: "date",
    headerName: "Date",

    width: 150,
    editable: false,
  },
  {
    field: "start_time",
    headerName: "Time",

    width: 100,
    editable: false,
  },
  {
    field: "table_no",
    headerName: "Table No",

    width: 100,
    editable: false,
  },
  {
    field: "guests",
    headerName: "Guests",
    type: "number",
    width: 100,
    editable: false,
  },
];
