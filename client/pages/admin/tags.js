import AdminLayout from "@/layouts/admin";
import React from "react";
import { Box, Typography, Grid, Divider } from "@mui/material";
import { TextField, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { TagsCuisineForm } from "@/sections/admin/TagsCusineForm";
import {
  useCreateCuisineMutation,
  useCreateTagsMutation,
  useCreateTypesMutation,
  useDeleteCuisineMutation,
  useDeleteTagsMutation,
  useDeleteTypesMutation,
  useGetTagTypeCuisineQuery,
} from "@/store/api/admin";
import * as Yup from "yup";
import withAuth from "@/utils/withAuth";
import { DeleteButton } from "@/sections/admin/GridComponents/DeleteDetails";
import Loading from "@/components/Loading";

const cuisineInitialValues = {
  cuisine: "",
};

const typeInitialValues = {
  type: "",
};

const tagsInitialValues = {
  tag: "",
  image: "  ",
};

// Tags Validation Schema
const tagsValidationSchema = Yup.object().shape({
  tag: Yup.string().required("Required"),
  image: Yup.string().required("Required"),
});

// Type Validation Schema
const typeValidationSchema = Yup.object().shape({
  type: Yup.string().required("Type is required"),
});

// Cuisine Validation Schema
const cuisineValidationSchema = Yup.object().shape({
  cuisine: Yup.string().required("Cuisine is required"),
});

function Tags() {
  // Cusines Submit Handler
  const [deleteTypes] = useDeleteTypesMutation();
  const [deleteCuisine] = useDeleteCuisineMutation();
  const [deleteTags] = useDeleteTagsMutation();

  const { data, isLoading } = useGetTagTypeCuisineQuery("", {
    refetchOnMountOrArgChange: true,
  });

  const [createTypes] = useCreateTypesMutation();
  const [createCuisine] = useCreateCuisineMutation();
  const [createTag] = useCreateTagsMutation();

  const cusineSubmitHandler = async (values, action) => {
    const cusinesData = {
      name: values.cuisine,
    };

    createCuisine(cusinesData);
    action.resetForm();
  };

  const tagsSubmitHandler = async (values, action) => {
    const tagData = {
      name: values.tag,
      image: values.image,
    };

    createTag(tagData);
    action.resetForm();
  };

  const typesSubmitHandler = async (values, action) => {
    const typesData = {
      name: values.type,
    };

    createTypes(typesData);
    action.resetForm();
  };

  const columnsTypes = [
    { field: "id", headerName: "ID", width: 200 },
    {
      field: "name",
      headerName: "Types",
      width: 300,
      editable: false,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => DeleteButton(params, deleteTypes, "Types"),
    },
  ];

  const columnsCusinies = [
    { field: "id", headerName: "ID", width: 200 },
    {
      field: "name",
      headerName: "Cuisnies",
      width: 300,
      editable: false,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => DeleteButton(params, deleteCuisine, "Cuisines"),
    },
  ];

  const columnsTags = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "name",
      headerName: "Tags",
      width: 250,
      editable: false,
    },
    {
      field: "image",
      headerName: "Image Url",
      width: 600,
      editable: false,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => DeleteButton(params, deleteTags, "Tags"),
    },
  ];

  return (
    <>
      <AdminLayout title="Edit Details">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }} gutterBottom>
            Add Tags, Types and Cuisines
          </Typography>
          <Divider />
        </Box>

        {isLoading ? (
          <Loading></Loading>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} lg={12}>
              <Typography variant="h5" sx={{ fontWeight: "bold" }} gutterBottom>
                Types
              </Typography>

              <TagsCuisineForm
                initialValues={typeInitialValues}
                validationSchema={typeValidationSchema}
                onSubmit={typesSubmitHandler}
                label="Types"
                name="type"
                buttonText="Add"
                rows={data?.types || []}
                columns={columnsTypes}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={12}>
              <Typography variant="h5" sx={{ fontWeight: "bold" }} gutterBottom>
                Cuisines
              </Typography>
              <TagsCuisineForm
                initialValues={cuisineInitialValues}
                validationSchema={cuisineValidationSchema}
                onSubmit={cusineSubmitHandler}
                label="Cuisnes"
                name="cuisine"
                buttonText="Add"
                rows={data?.cuisines || []}
                columns={columnsCusinies}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <Typography variant="h5" sx={{ fontWeight: "bold" }} gutterBottom>
                Tags
              </Typography>
              <Formik
                initialValues={tagsInitialValues}
                validationSchema={tagsValidationSchema}
                onSubmit={tagsSubmitHandler}
              >
                {({ values, setFieldValue }) => (
                  <Form>
                    <Grid container rowSpacing={2} columnSpacing={3}>
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Field
                          name="tag"
                          label="Tag Name"
                          size="small"
                          as={TextField}
                          helperText={<ErrorMessage name="tag" />}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Field
                          name="image"
                          label="Image"
                          size="small"
                          as={TextField}
                          helperText={<ErrorMessage name="name" />}
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
                      <Grid item xs={12}>
                        <Box sx={{ height: 400, width: "100%" }}>
                          <DataGrid
                            rows={data?.tags || []}
                            columns={columnsTags}
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
            </Grid>
          </Grid>
        )}
      </AdminLayout>
    </>
  );
}

export default withAuth(Tags, ["1"], "/admin");
