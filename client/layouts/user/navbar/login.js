// packages
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
// css
import styles from "@/styles/Login.module.css";

const initialValues = { password: "" };

const validationSchema = Yup.object({
  password: Yup.string().min(6).required("Enter your Password"),
});

function Login({ onSubmit, setAuthPage }) {
  return (
    <>
      <h1 className={styles.h1}>Login </h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form className={styles.form}>
          <label className={styles.label}>Password</label>
          <Field
            name="password"
            id="password"
            className={styles.input}
            type="password"
          />
          <div className={styles.error}>
            <ErrorMessage name="password" />
          </div>

          <input
            style={{ border: "none" }}
            type="submit"
            value="Sign In"
            className={styles.input}
          />
          <button
            style={{ border: "none" }}
            className={styles.input}
            onClick={() => setAuthPage("forgotPage")}
          >
            Forgot Password
          </button>
        </Form>
      </Formik>
    </>
  );
}

export default Login;
