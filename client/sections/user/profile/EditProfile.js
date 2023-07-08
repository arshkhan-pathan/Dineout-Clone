import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import axios from "axios";
import { TextField, Grid, Button } from "@mui/material";
import {
  useGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
} from "@/store/api/profile";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

const validationSchema = Yup.object({
  firstname: Yup.string().min(2).max(25).required("Enter your First Name"),
  lastname: Yup.string().min(2).max(25).required("Enter your Last Name"),
});

const initialValues = {
  firstname: "",
  lastname: "",
};

function EditProfile() {
  const { data } = useGetCurrentUserQuery("s", {
    refetchOnMountOrArgChange: true,
  });
  const [updateCurrentUser] = useUpdateCurrentUserMutation();
  const [initialData, setInitialData] = useState(initialValues);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async (values) => {
    try {
      let imageurl = "";

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("upload_preset", "resImages");
        formData.append("api_key", "257987867351426");
        formData.append("timestamp", Math.floor(Date.now() / 1000));

        const response = await toast.promise(
          axios.post(
            "https://api.cloudinary.com/v1_1/dhe9hmzbn/image/upload",
            formData,
            { headers: { "X-Requested-With": "XMLHttpRequest" } }
          ),
          {
            loading: "Updating Data",
            success: "Data Updated successfully!",
            error: "Error uploading image",
          }
        );

        imageurl = response.data.secure_url;
      }

      const submitData = {
        image_url: imageurl,
        first_name: values.firstname,
        last_name: values.lastname,
      };

      updateCurrentUser(submitData);
    } catch (error) {}
  };

  useEffect(() => {
    if (data) {
      setInitialData({
        firstname: data.first_name,
        lastname: data.last_name,
        imageUrl: data?.image_url,
      });
    }
  });

  return (
    <>
      <h2>Edit Profile</h2>
      <Formik
        initialValues={initialData}
        validationSchema={validationSchema}
        onSubmit={handleUpload}
        enableReinitialize
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Grid
              container
              rowSpacing={3}
              columnSpacing={3}
              sx={{ margin: "0px" }}
            >
              <Grid item>
                <Field
                  name="firstname"
                  label="First Name"
                  size="small"
                  as={TextField}
                  helperText={<ErrorMessage name="firstname" />}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <Field
                  name="lastname"
                  label="Last Name"
                  size="small"
                  as={TextField}
                  helperText={<ErrorMessage name="lastname" />}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Update
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default EditProfile;
