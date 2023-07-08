import { Grid, Box, Tooltip, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
// packages
import { TextField, Button } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
// components
import {
  useCreateTableMutation,
  useGetRestaurantTableQuery,
} from "@/store/api/restaurant";
import { selectCurrentUser } from "@/store/slices/auth";
import { useSelector } from "react-redux";
import { useDeleteTableMutation } from "@/store/api/restaurant";
import { Typography } from "@mui/material";
import { Divider } from "@mui/material";
import Loading from "@/components/Loading";

// store

const initialValues = {
  table_number: "",
  capacity: "",
};

const validationSchema = Yup.object().shape({
  table_number: Yup.string().required("Table number is required"),
  capacity: Yup.number()
    .required("Capacity is required")
    .positive("Capacity must be a positive number")
    .integer("Capacity must be an integer"),
});

export const DeleteTable = (params) => {
  const user = useSelector(selectCurrentUser);
  const [deleteTable, { isLoading }] = useDeleteTableMutation();
  const onDeleteTable = () => {
    const payload = { id: user?.id, tableId: params.row.id };
    deleteTable(payload);
  };

  return (
    <Tooltip title="Delete">
      <IconButton onClick={onDeleteTable}>
        <DeleteIcon sx={{ color: "red" }} />
      </IconButton>
    </Tooltip>
  );
};

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "table_number",
    headerName: "Table Number",
    width: 150,
    editable: false,
  },

  {
    field: "capacity",
    headerName: "Capacity",
    type: "number",
    width: 110,
    editable: false,
  },
  {
    field: "is_occupied",
    headerName: "Occupied",
    type: "text",
    width: 110,
    editable: false,
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 150,
    renderCell: DeleteTable,
  },
];

const TablesSummary = () => {
  const user = useSelector(selectCurrentUser);
  const [createTable] = useCreateTableMutation();
  const { data, isLoading } = useGetRestaurantTableQuery(user?.id, {
    refetchOnMountOrArgChange: true,
  });

  const onSubmit = async (values, action) => {
    //

    const tableData = {
      table_number: values.table_number,
      capacity: values.capacity,
    };

    const payload = { id: user?.id, tableData: tableData };

    try {
      const data = await createTable(payload);

      // After successful submission, fetch the updated table data
    } catch (error) {
      console.error(error);
    }
    action.resetForm();
  };
  return (
    <>
      {isLoading ? (
        <Loading></Loading>
      ) : (
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({ values, setFieldValue }) => (
                  <Form>
                    <Grid container rowSpacing={2} columnSpacing={3}>
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Field
                          name="table_number"
                          label="Table Number"
                          size="small"
                          as={TextField}
                          helperText={<ErrorMessage name="table_capacity" />}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Field
                          name="capacity"
                          label="Capacity"
                          size="small"
                          type="number"
                          as={TextField}
                          helperText={<ErrorMessage name="capacity" />}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                        >
                          Add
                        </Button>
                      </Grid>
                    </Grid>
                  </Form>
                )}
              </Formik>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={8}>
              {data?.length > 0 ? (
                <DataGrid
                  rows={data || []}
                  autoHeight
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
              ) : (
                <>
                  <Grid item xs={12} textAlign="start">
                    <Typography fontWeight="bold">
                      Table data not available. Please add a table to view.
                    </Typography>
                    <Divider />
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};

export default TablesSummary;
