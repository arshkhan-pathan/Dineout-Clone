import React from "react";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
// store
import { useAdminLoginMutation } from "@/store/api/auth";
import { setCredentials } from "@/store/slices/auth";
// components
import AdminAuth from "@/sections/admin/AdminAuth";
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
    .min(3, "Password should be atleaset 8 characters")
    .required("Please enter your new password"),
});

function Index() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login] = useAdminLoginMutation();

  const onSubmit = async (values) => {
    try {
      const response = await login(values).unwrap();

      if (response && response.statusCode == 200) {
        dispatch(setCredentials({ ...response }));
        toast.success("Succesfully Authenticated");
        router.push("/admin/dashboard");
      }
    } catch (error) {
      toast.error("Invalid Credentials Provided or Invalid Role");
    }
  };
  return (
    <>
      <>
        <AdminAuth
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        />
      </>
    </>
  );
}

export default loginRedirect(Index, "admin/dashboard");
