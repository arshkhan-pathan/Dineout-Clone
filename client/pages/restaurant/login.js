// packages
import { useRouter } from "next/router";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
// store
import { useRestaurantLoginMutation } from "@/store/api/auth";
import { setCredentials } from "@/store/slices/auth";
// components
import Auth from "@/components/Auth";
import Head from "next/head";
import loginRedirect from "@/utils/loginRedirect";

const initialValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter an valid email address")
    .required("Email address is required"),
  password: Yup.string()
    .min(8, "Password should be atleaset 8 characters")
    .required("Please enter your new password"),
});

const Login = () => {
  const [login] = useRestaurantLoginMutation();
  const router = useRouter();
  const dispatch = useDispatch();

  const onSubmit = async (values) => {
    try {
      const user = await login(values).unwrap();

      if (user && user.statusCode == 200) {
        dispatch(setCredentials({ ...user }));
        toast.success("Succesfully Authenticated");
        router.push("/restaurant");
      }
    } catch (error) {
      toast.error("Invalid Credentials Provided or Invalid Role");
    }
  };
  return (
    <>
      <>
        <Head>
          <title>Manager Login</title>
        </Head>
        <Auth
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        />
      </>
    </>
  );
};

export default loginRedirect(Login, "/restaurant");
