// packages
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
// css
import styles from "@/styles/Login.module.css";

const initialValues = {
  firstName: "",
  lastName: "",
  password: "",
  confirmPassword: "",
};

const validationSchema = Yup.object({
  firstName: Yup.string().min(2).max(25).required("Enter your First Name"),
  lastName: Yup.string().min(2).max(25).required("Enter your Last Name"),
  password: Yup.string().min(6).required("Enter your Password"),
  confirmPassword: Yup.string()
    .required("Renter your Password")
    .oneOf([Yup.ref("password"), null], "Password must match"),
});

const Register = ({ onSubmit }) => {
  return (
    <>
      <h1 className={styles.h1}> Signup </h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form className={styles.form}>
          <label className={styles.label}>First Name</label>
          <Field name="firstName" id="firstName" className={styles.input} />
          <div className={styles.error}>
            <ErrorMessage name="firstName" />
          </div>
          <label className={styles.label}>Last Name</label>
          <Field name="lastName" id="lastName" className={styles.input} />
          <div className={styles.error}>
            <ErrorMessage name="lastName" />
          </div>

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
            value="Sign Up"
            className={styles.input}
          />
        </Form>
      </Formik>
    </>
  );
};

export default Register;
