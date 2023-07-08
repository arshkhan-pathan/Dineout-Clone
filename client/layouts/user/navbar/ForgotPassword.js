// packages
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
// css
import styles from "@/styles/Login.module.css";

const initialValues = {
  password: "",
  confirmPassword: "",
};

const validationSchema = Yup.object({
  password: Yup.string().min(6).required("Enter your Password"),
  confirmPassword: Yup.string()
    .required("Renter your Password")
    .oneOf([Yup.ref("password"), null], "Password must match"),
});

const ForgotPassword = ({ tokens }) => {
  const onSubmit = async (values) => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/users/reset_password_confirm/`,
        {
          uid: tokens[0],
          token: tokens[1],
          new_password: values.password,
        }
      )
      .then(function (response) {
        //
      })
      .catch(function (error) {
        //
      });
    //
  };

  return (
    <div className={styles.body}>
      <div className={styles.parent1}>
        <h1 className={styles.h1}> Forgot Password </h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form className={styles.form}>
            <label className={styles.label}>Password</label>
            <Field name="password" id="password" className={styles.input} />
            <div className={styles.error}>
              <ErrorMessage name="password" />
            </div>

            <label className={styles.label}>Confirm Password</label>
            <Field
              name="confirmPassword"
              id="confirmPassword"
              className={styles.input}
            />
            <div className={styles.error}>
              <ErrorMessage name="confirmPassword" />
            </div>

            <input
              style={{ border: "none" }}
              type="submit"
              value="Sign In"
              className={styles.input}
            />
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default ForgotPassword;
