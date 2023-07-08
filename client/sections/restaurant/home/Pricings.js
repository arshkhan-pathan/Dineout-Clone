import { Grid, Box, IconButton, Tooltip } from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import { selectCurrentUser } from "@/store/slices/auth";
import { DataGrid } from "@mui/x-data-grid";
import * as Yup from "yup";
import { TextField, Button } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Loading from "@/components/Loading";
import Select from "@/components/Select";
import { Typography, Divider } from "@mui/material";
import {
  useGetRestaurantPricingsQuery,
  useCreatePricingMutation,
  useDeleteRuleMutation,
} from "@/store/api/restaurant";

export const DeletePricing = (params) => {
  const user = useSelector(selectCurrentUser);
  const [deleteRule] = useDeleteRuleMutation();
  const onDeletePricing = () => {
    const payload = { id: user?.id, ruleId: params.row.id };

    deleteRule(payload);
  };

  return (
    <Tooltip title="Delete">
      <IconButton onClick={onDeletePricing}>
        <DeleteIcon sx={{ color: "red" }} />
      </IconButton>
    </Tooltip>
  );
};
const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const columns = [
  { field: "id", headerName: "ID", width: 90 },

  {
    field: "day_of_week",
    headerName: "Day",
    width: 150,
    editable: false,
    valueFormatter: (params) => daysOfWeek[params.value],
    // valueGetter: (params) =>
    //   `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  },
  {
    field: "start_time",
    headerName: "Start Time",
    width: 110,
    editable: true,
  },
  {
    field: "end_time",
    headerName: "End Time",
    sortable: true,
    width: 160,
  },
  {
    field: "price_multiplier",
    headerName: "Price Multiplier",
    sortable: false,
    width: 160,
  },
  {
    field: "price_offset",
    headerName: "Price Offset",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 150,
    renderCell: DeletePricing,
  },
];

const initialValues = {
  price_start_time: "",
  price_end_time: "",
  price_multiplier: "",
  price_offset: "",
  price_day: "",
};

// validation schema
const validationSchema = Yup.object({
  price_offset: Yup.number()
    .required("Enter Price Offset")
    .positive()
    .integer(),
  price_multiplier: Yup.number()
    .required("Enter Price Multiplier")
    .positive()
    .integer(),
});

const dayOptions = [
  {
    id: 0,
    name: "Monday",
  },
  {
    id: 1,
    name: "Tuesday",
  },
  {
    id: 2,
    name: "Wednesday",
  },
  {
    id: 3,
    name: "Thursday",
  },
  {
    id: 4,
    name: "Friday",
  },
  {
    id: 5,
    name: "Saturday",
  },
  {
    id: 6,
    name: "Sunday",
  },
];

const Pricing = () => {
  const user = useSelector(selectCurrentUser);
  const { data, isLoading } = useGetRestaurantPricingsQuery(user?.id);
  const [createPricing] = useCreatePricingMutation();

  const onSubmit = async (values, action) => {
    const pricingData = {
      price_offset: values.price_offset,
      day_of_week: values.price_day.id,
      price_multiplier: values.price_multiplier,
      end_time: values.price_end_time,
      start_time: values.price_start_time,
    };

    const payload = { id: user?.id, pricingData: pricingData };
    try {
      createPricing(payload);
    } catch (error) {
      console.error(error);
    }
    action.resetForm();
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({ values, setFieldValue }) => (
                  <Form>
                    <Grid container rowSpacing={3} columnSpacing={3}>
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Field
                          name="price_start_time"
                          label="Start Time"
                          type="time"
                          size="small"
                          as={TextField}
                          helperText={<ErrorMessage name="name" />}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Field
                          name="price_end_time"
                          label="End Time"
                          size="small"
                          type="time"
                          as={TextField}
                          helperText={<ErrorMessage name="locality" />}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Field
                          name="price_multiplier"
                          label="Multiplier"
                          type="number"
                          size="small"
                          as={TextField}
                          helperText={<ErrorMessage name="address" />}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Field
                          name="price_offset"
                          type="number"
                          label="Offset"
                          size="small"
                          as={TextField}
                          helperText={<ErrorMessage name="city" />}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Select
                          options={dayOptions}
                          value={values.price_day}
                          onChange={(values) =>
                            setFieldValue("price_day", values)
                          }
                          placeholder="Day"
                          isMulti={false}
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
            <Grid item xs={12}>
              {data?.length > 0 ? (
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
                  pageSizeOptions={[5]}
                  disableRowSelectionOnClick
                />
              ) : (
                <>
                  <Grid item xs={12} textAlign="start">
                    <Typography fontWeight="bold">
                      Rules data not available. Please add a Rule to view.
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

export default Pricing;
