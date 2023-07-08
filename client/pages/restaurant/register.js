// packages
import { useRouter } from "next/router";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
// store
import { useRestaurantRegisterMutation } from "@/store/api/auth";
import { setCredentials } from "@/store/slices/auth";
// components
import Auth from "@/components/Auth";
import { toast } from "react-hot-toast";
import Head from "next/head";
import loginRedirect from "@/utils/loginRedirect";

const initialValues = {
  first_name: "",
  city: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const validationSchema = Yup.object({
  first_name: Yup.string(),
  city: Yup.string(),
  email: Yup.string()
    .email("Please enter an valid email address")
    .required("Email address is required"),
  password: Yup.string()
    .min(8, "Password should be atleaset 6 characters")
    .required("Please enter your new password"),
  confirmPassword: Yup.string()
    .min(8, "Password should be atleaset 6 characters")
    .required("Please enter your confirm password")
    .oneOf([Yup.ref("password"), null], "Passwords does not match"),
});

const Register = () => {
  const [register] = useRestaurantRegisterMutation();
  const router = useRouter();
  const dispatch = useDispatch();

  const onSubmit = async (values) => {
    try {
      const response = await register({
        ...values,
      });

      if (response && response.data.status == 201) {
        const { data } = response;
        const { user, access } = data;
        dispatch(setCredentials({ user: user, token: access }));
        toast.success("Signed Up Successfully!!");
      }
    } catch (error) {}
  };

  return (
    <>
      <Head>
        <title>Manager Signup</title>
      </Head>
      <Auth
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        authType="Sign Up"
      />
    </>
  );
};

export default loginRedirect(Register, "/restaurant/manage");
