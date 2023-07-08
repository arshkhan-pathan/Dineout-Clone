import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { TextField, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Grid } from "@mui/material";

export const TagsCuisineForm = ({
  initialValues,
  validationSchema,
  onSubmit,
  label,
  name,
  buttonText,
  rows,
  columns,
}) => (
  <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={onSubmit}
  >
    {({ values, setFieldValue }) => (
      <Form>
        <Grid container rowSpacing={2} columnSpacing={3}>
          <Grid item xs={4}>
            <Field
              name={name}
              label={label}
              size="small"
              as={TextField}
              helperText={<ErrorMessage name={name} />}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              {buttonText}
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={rows}
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
          </Grid>
        </Grid>
      </Form>
    )}
  </Formik>
);
