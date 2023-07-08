// packages
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
// store
import { setCredentials } from "@/store/slices/auth";
import { useLoginMutation, useRegisterMutation } from "@/store/api/auth";
//
import Login from "./login";
import Register from "./Register";
import Form from "./Form";
//Snacks

const Auth = ({ onClose }) => {
  const [authPage, setAuthPage] = useState("auth");
  const [email, setEmail] = useState("");
  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();
  const dispatch = useDispatch();

  const onValidate = (values) => {
    setEmail(values.email);

    //api call to check if user exists!
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${values.email}`)
      .then(function (response) {
        if (response.status == 200) {
          setAuthPage("login");
        }
      })
      .catch(function (error) {
        setAuthPage("register");
      });
  };

  const onLogin = async (values) => {
    try {
      const user = await toast.promise(
        login({ email, password: values.password }).unwrap(),
        {
          loading: "Authenticating...",
          success: "Successfully Authenticated!",
          error: "Invalid Credentials",
        }
      );
      console.log(user);
      dispatch(setCredentials({ ...user }));
      onClose();
    } catch (err) {
      console.error("Invalid Credentials");
    }
  };
  const onRegister = async (values) => {
    const { firstName, lastName, password, confirmPassword } = values;
    try {
      const user = await toast.promise(
        register({
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
          password2: confirmPassword,
        }).unwrap(),
        {
          loading: "Registering...",
          success: "Successfully Registered!",
          error: "Invalid Credentials",
        }
      );
      console.log(user);
      dispatch(setCredentials({ ...user }));
      onClose();
    } catch (err) {
      console.error("Invalid Credentials");
    }
  };

  const onSendEmail = (values) => {
    // Send Request to Backend For password Reset
    const get = axios
      .post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/users/reset_password/`, {
        email: values.email,
      })
      .then(function (response) {
        setAuthPage("message");
      })
      .catch(function (error) {});
    toast.promise(get, {
      loading: "Wait Chef is Sending You Reset Link",
      success: "Please Check Your Mail For Resting Password",
      error: "Error when fetching",
    });
  };

  if (authPage === "login")
    return <Login onSubmit={onLogin} setAuthPage={setAuthPage} />;

  if (authPage === "register") return <Register onSubmit={onRegister} />;

  if (authPage === "forgotPage")
    return <Form title={"Forgot Password"} onSubmit={onSendEmail} />;

  if (authPage === "message")
    return <div>Password Rest Link has been sent to your mail!</div>;

  return <Form onSubmit={onValidate} title={"Login / SignUp"} />;
};

export default Auth;
