import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { TextField, Grid, Button } from "@mui/material";
import { toast } from "react-hot-toast";
import { useChangePasswordMutation } from "@/store/api/auth";

const validationSchema = Yup.object({
  old_password: Yup.string()
    .min(6)
    .max(25)
    .required("Enter your Current Passowrd"),
  new_password: Yup.string().min(2).max(25).required("Enter your New Password"),
});

const initialValues = {
  old_password: "",
  new_password: "",
};

function ChangePassword() {
  const [changePassword] = useChangePasswordMutation();
  const handleUpdate = async (values) => {
    try {
      const submitData = {
        old_password: values.old_password,
        new_password: values.new_password,
      };

      const response = await toast.promise(
        changePassword(submitData).unwrap(),
        {
          loading: "Updating password...",
          success: "Password updated successfully!",
          error: "Error updating password",
        }
      );
    } catch (error) {
      if (error.data.old_password) {
        toast.error("Wrong Current Password");
      }
    }
  };

  return (
    <>
      <h2>Change Password</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleUpdate}
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
                  name="old_password"
                  label="Current Password"
                  size="small"
                  as={TextField}
                  helperText={<ErrorMessage name="old_password" />}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <Field
                  name="new_password"
                  label="New Password"
                  size="small"
                  as={TextField}
                  helperText={<ErrorMessage name="new_password" />}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Update Password
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default ChangePassword;
