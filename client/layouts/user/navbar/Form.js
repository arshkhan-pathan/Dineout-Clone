// packages
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
// css
import styles from "@/styles/Login.module.css";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLoginMutation } from "@/store/api/auth";
import { setCredentials } from "@/store/slices/auth";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
const initialValues = {
  email: "",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter an valid email address")
    .required("Email address is required"),
});

const Form = ({ onSubmit, title }) => {
  const [googleLogin] = useGoogleLoginMutation();
  const dispatch = useDispatch();

  const responseMessage = async (response) => {
    console.log(response);
    const { credential } = response;
    const body = {
      auth_token: credential,
    };

    try {
      const user = await toast.promise(googleLogin(body).unwrap(), {
        loading: "Authenticating...",
        success: "Successfully Authenticated!",
        error: "Invalid Credentials",
      });
      console.log(user);
      dispatch(setCredentials({ ...user }));
      onClose();
    } catch (err) {
      console.error("Some Problem Occured");
    }
  };
  const errorMessage = (error) => {
    console.log(error);
  };
  return (
    <div>
      <h1 className={styles.h1}>{title}</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <FormikForm className={styles.form}>
          <label className={styles.label}>Email</label>
          <Field name="email" id="useremail" className={styles.input} />
          <div className={styles.error}>
            <ErrorMessage name="email" />
          </div>

          <input
            style={{ border: "none" }}
            type="submit"
            value="Continue"
            className={styles.input}
          />
          <GoogleLogin
            width={270}
            onSuccess={responseMessage}
            onError={errorMessage}
          />
        </FormikForm>
      </Formik>
    </div>
  );
};

export default Form;
