// packages
import {
  Container,
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  InputAdornment,
} from "@mui/material";
import withAuth from "@/utils/withAuth";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import RestaurantLayout from "@/layouts/restaurant";
// components
import Select from "@/components/Select";
import Dropzone from "@/components/Dropzone";
// store
import {
  useCreateRestaurantMutation,
  useGetTagsQuery,
  useGetCuisinesQuery,
  useGetTypesQuery,
  useGetRestaurantByIdQuery,
  useUpdateRestaurantMutation,
} from "@/store/api/restaurant";
import { selectCurrentUser } from "@/store/slices/auth";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import IconButton from "@mui/material/IconButton";

// initial values
const initialRestaurantValues = {
  name: "",
  locality: "",
  address: "",
  city: "",
  avgCost: "",
  coordinates: "",
  phoneNumber: "",
  description: "",
  tags: [],
  cuisines: [],
  types: [],
  openingTime: "",
  closingTime: "",
  unitCharge: "",
  restaurantImages: [],
  menuImages: [],
};

// validation schema
const validationSchema = Yup.object({
  name: Yup.string()
    .min(2)
    .max(25)
    .required("Please enter your restaurant name"),
  locality: Yup.string().min(2).max(50).required("Please enter your locality"),
  address: Yup.string().min(2).max(70).required("Please enter your address"),
  city: Yup.string().min(2).max(15).required("Please enter your city"),
  avgCost: Yup.number().required("Enter average cost").positive().integer(),
  coordinates: Yup.string().min(2).required("Enter Your location link"),
  phoneNumber: Yup.string()
    .matches(/^\d{10,}$/, "Invalid phone number")
    .required("Enter your phone number"),
  description: Yup.string()
    .min(2)
    .max(100)
    .required("Please enter description"),
  unitCharge: Yup.number().required("Enter charges").positive().integer(),
});

const Manage = () => {
  const [initialValues, setInitialValues] = useState(initialRestaurantValues);
  const router = useRouter();
  const user = useSelector(selectCurrentUser);
  const [updateRestaurant] = useUpdateRestaurantMutation();
  const { data: tagOptions } = useGetTagsQuery();
  const { data: cuisineOptions } = useGetCuisinesQuery();
  const { data: typeOptions } = useGetTypesQuery();
  const [createRestaurant] = useCreateRestaurantMutation();
  const { data: restaurantData } = useGetRestaurantByIdQuery(user?.id, {
    refetchOnMountOrArgChange: true,
  });
  const [State, setState] = useState("Add");

  useEffect(() => {
    if (restaurantData) {
      const formattedRestaurantData = {
        name: restaurantData.name,
        locality: restaurantData.locality,
        address: restaurantData.address,
        city: restaurantData.city,
        avgCost: restaurantData.avg_cost,
        coordinates: restaurantData.coordinates,
        phoneNumber: restaurantData.phone_number,
        description: restaurantData.description,
        tags: restaurantData.tags,
        cuisines: restaurantData.cuisines,
        types: restaurantData.types,
        openingTime: restaurantData.opening_time,
        closingTime: restaurantData.closing_time,
        unitCharge: restaurantData.unit_charge,
        restaurantImages: [],
        menuImages: [],
      };
      setState("Update");

      setInitialValues(formattedRestaurantData);
    }
  }, [restaurantData]);

  const uploadOnCloudinary = async (files) => {
    let uploadedLinks = [];
    const listSecureUrl = files?.map(async (imgFile) => {
      const formData = new FormData();
      const { file } = imgFile;
      formData.append("file", file);
      formData.append("upload_preset", "resImages");
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_KEY);
      formData.append("timestamp", (Date.now() / 1000) | 0);

      const response = await axios.post(
        process.env.NEXT_PUBLIC_CLOUDINARY_URL,
        formData,
        {
          headers: { "X-Requested-With": "XMLHttpRequest" },
        }
      );

      const secure_url = response?.data?.secure_url;
      uploadedLinks.push(secure_url);
      return secure_url;
    });

    await Promise.all(listSecureUrl); // Wait for all the image uploads to complete

    return uploadedLinks;
  };

  const onSubmit = async (values) => {
    // upload images to cloudinary

    // format fields accordingly
    const formatedValues = {
      name: values.name,
      locality: values.locality,
      city: values.city,
      address: values.address,
      description: values.description,
      coordinates: values.coordinates,
      phone_number: values.phoneNumber,
      avg_cost: values.avgCost,
      opening_time: values.openingTime,
      closing_time: values.closingTime,
      tag_list: values.tags.map((tag) => tag.id),
      types_list: values.types.map((type) => type.id),
      cuisines_list: values.cuisines.map((cuisine) => cuisine.id),
      unit_charge: values.unitCharge,
      manager: user.id,
      uploaded_images: [],
      uploaded_menuImages: [],
    };

    if (values?.restaurantImages) {
      const uploaded_images = await toast.promise(
        uploadOnCloudinary(values?.restaurantImages),
        {
          loading: "Uploading restaurant images...",
          success: "Restaurant images uploaded successfully!",
          error: "Failed to upload restaurant images.",
        }
      );

      formatedValues.uploaded_images = uploaded_images;
    }

    if (values?.menuImages) {
      const uploaded_menuImages = await toast.promise(
        uploadOnCloudinary(values?.menuImages),
        {
          loading: "Uploading menu images...",
          success: "Menu images uploaded successfully!",
          error: "Failed to upload menu images.",
        }
      );

      formatedValues.uploaded_menuImages = uploaded_menuImages;
    }

    // create a new restaurant
    if (State == "Add") {
      const response = await toast.promise(createRestaurant(formatedValues), {
        loading: "Creating restaurant...",
        success:
          "Restaurant created successfully! Now Add Tables to Recieve Bookings on them",
        error: "Failed to create restaurant.",
      });
      router.push("/restaurant/tables");
    }

    if (State == "Update") {
      const payload = { id: restaurantData.manager, data: formatedValues };

      await toast.promise(updateRestaurant(payload), {
        loading: "Updating restaurant...",
        success: "Restaurant updated successfully!",
        error: "Failed to update restaurant.",
      });
    }
  };

  return (
    <>
      <RestaurantLayout title="Manage">
        <Box sx={{ my: 5 }}>
          <Container maxWidth="xl">
            <Box>
              <Box>
                <Typography variant="h5" gutterBottom>
                  Add / Manage Restaurant
                </Typography>
              </Box>

              <Box>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                  enableReinitialize
                >
                  {({ values, setFieldValue }) => (
                    <Form>
                      <Grid container rowSpacing={3} columnSpacing={3}>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                          <Field
                            name="name"
                            label="Name"
                            size="small"
                            value={values.name}
                            as={TextField}
                            helperText={<ErrorMessage name="name" />}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                          <Field
                            name="locality"
                            label="Locality"
                            size="small"
                            as={TextField}
                            helperText={<ErrorMessage name="locality" />}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                          <Field
                            name="address"
                            label="Address"
                            size="small"
                            as={TextField}
                            helperText={<ErrorMessage name="address" />}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                          <Field
                            name="city"
                            label="City"
                            size="small"
                            as={TextField}
                            helperText={<ErrorMessage name="city" />}
                            fullWidth
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3}>
                          <Field
                            name="avgCost"
                            label="Average Cost"
                            size="small"
                            as={TextField}
                            helperText={<ErrorMessage name="avgCost" />}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                          <Field
                            name="coordinates"
                            label="Coordinates"
                            size="small"
                            as={TextField}
                            helperText={<ErrorMessage name="coordinates" />}
                            fullWidth
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="start">
                                  <IconButton
                                    onClick={() => {
                                      navigator.geolocation.getCurrentPosition(
                                        (position) => {
                                          const { coords } = position;
                                          const { latitude, longitude } =
                                            coords;
                                          const coordinates = `${latitude}, ${longitude}`;
                                          setFieldValue(
                                            "coordinates",
                                            coordinates
                                          );
                                        },
                                        (error) => {
                                          console.log(error);
                                          toast.error(
                                            "Please Enable Location Permisson"
                                          );
                                        }
                                      );
                                    }}
                                    edge="end"
                                  >
                                    <AddLocationIcon />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                          <Field
                            name="phoneNumber"
                            label="Phone Number"
                            size="small"
                            as={TextField}
                            helperText={<ErrorMessage name="phoneNumber" />}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                          <Field
                            name="description"
                            label="Description"
                            size="small"
                            as={TextField}
                            helperText={<ErrorMessage name="description" />}
                            fullWidth
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3}>
                          <Select
                            options={tagOptions}
                            value={values.tags}
                            onChange={(values) => setFieldValue("tags", values)}
                            placeholder="Tags"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                          <Select
                            options={cuisineOptions}
                            value={values.cuisines}
                            onChange={(values) =>
                              setFieldValue("cuisines", values)
                            }
                            placeholder="Cuisines"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                          <Select
                            options={typeOptions}
                            value={values.types}
                            onChange={(values) =>
                              setFieldValue("types", values)
                            }
                            placeholder="Types"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                          <Field
                            name="unitCharge"
                            label="Unit Charge"
                            size="small"
                            type="number"
                            as={TextField}
                            helperText={<ErrorMessage name="unitCharge" />}
                            fullWidth
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} lg={3}>
                          <Field
                            name="openingTime"
                            size="small"
                            type="time"
                            as={TextField}
                            helperText={<ErrorMessage name="openingTime" />}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                          <Field
                            name="closingTime"
                            size="small"
                            type="time"
                            as={TextField}
                            helperText={<ErrorMessage name="closingTime" />}
                            fullWidth
                          />
                        </Grid>
                        <Grid container item xs={12} spacing={3}>
                          <Grid item xs={12} sm={6}>
                            <Dropzone
                              title="Restaurant"
                              allFiles={values.restaurantImages}
                              handleDrop={(acceptedFiles) => {
                                const newFiles = acceptedFiles.map((file) => ({
                                  file,
                                  // preview: URL.createObjectURL(file),
                                }));
                                setFieldValue("restaurantImages", [
                                  ...values.restaurantImages,
                                  ...newFiles,
                                ]);
                              }}
                              handleDelete={(index) => {
                                const newFiles = [...values.restaurantImages];
                                newFiles.splice(index, 1);
                                setFieldValue("restaurantImages", newFiles);
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={6} lg={6}>
                            <Dropzone
                              title="Menu"
                              allFiles={values.menuImages}
                              handleDrop={(acceptedFiles) => {
                                const newFiles = acceptedFiles.map((file) => ({
                                  file,
                                  // preview: URL.createObjectURL(file),
                                }));
                                setFieldValue("menuImages", [
                                  ...values.menuImages,
                                  ...newFiles,
                                ]);
                              }}
                              handleDelete={(index) => {
                                const newFiles = [...values.menuImages];
                                newFiles.splice(index, 1);
                                setFieldValue("menuImages", newFiles);
                              }}
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                          >
                            {State}
                          </Button>
                        </Grid>
                      </Grid>
                    </Form>
                  )}
                </Formik>
              </Box>
            </Box>
          </Container>
        </Box>
      </RestaurantLayout>
    </>
  );
};

export default withAuth(Manage, [2], "/restaurant/login");
