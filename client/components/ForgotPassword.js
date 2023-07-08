// packages
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { styled, useMediaQuery, Box } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Image from "next/image";
// images
import illustrationImage from "@/assets/images/rest.gif";
import dineoutLogo from "@/assets/images/dineout_logo.webp";
import { useRouter } from "next/router";
import * as yup from "yup";
import { useResetPasswordMutation } from "@/store/api/auth";
import { toast } from "react-hot-toast";

// styled
const StyledPaper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  margin: theme.spacing(1),
  backgroundColor: theme.palette.secondary.main,
}));

const StyledForm = styled(Form)(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(3),
  "& .css-1wc848c-MuiFormHelperText-root": {
    marginLeft: 0,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

const StyledErrorMessage = styled(ErrorMessage)(() => ({
  color: "red",
}));

const StyledRoot = styled("div")(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    margin: "50px 0",
  },
  height: "100vh",
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const StyledLogo = styled(Image)(({ theme }) => ({
  position: "fixed",
  top: 16,
  left: 16,
  [theme.breakpoints.up("sm")]: {
    top: 24,
    left: 24,
  },
  [theme.breakpoints.up("md")]: {
    top: 40,
    left: 40,
  },
}));

const StyledSection = styled("div")(({ theme }) => ({
  width: "100%",
  maxWidth: 480,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  boxShadow: theme.shadows[1],
  backgroundColor: theme.palette.background.default,
}));

const initialValues = { password: "", confirmPassword: "" };
const validationSchema = yup.object().shape({
  password: yup
    .string()
    .required("Please enter a password.")
    .min(8, "Password must be at least 8 characters long."),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match.")
    .required("Please confirm your password."),
});

const ForgotPassword = ({ tokens }) => {
  const isDesktop = useMediaQuery("(min-width: 1000px)");
  const [resetPassword] = useResetPasswordMutation();
  const router = useRouter();
  const onSubmit = async (values) => {
    const submitData = {
      uid: tokens[0],
      token: tokens[1],
      new_password: values.password,
    };

    try {
      const promise = resetPassword(submitData).unwrap();
      toast.promise(promise, {
        loading: "Resetting password...",
        success: "Password reset successfully!",
        error: "Failed to reset password. Please try again.",
      });

      //
      router.push("/");
    } catch (error) {
      // console.error("Error resetting password:", error);
      toast("Failed to reset password. Please try again.", {
        appearance: "error",
      });
    }
  };

  return (
    <StyledRoot>
      <StyledLogo
        src={dineoutLogo}
        width={80}
        height={30}
        onClick={() => {
          router.push("/");
        }}
      />

      {isDesktop && (
        <StyledSection>
          <Typography variant="h5" sx={{ px: 5, mt: 10, mb: 5 }}>
            Hi, Welcome to Password Reset Page
          </Typography>
          <Image
            src={illustrationImage}
            alt="login"
            width="650"
            style={{ width: "100%", objectFit: "contain" }}
          />
        </StyledSection>
      )}
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <StyledPaper>
            <StyledAvatar>
              <LockOutlinedIcon />
            </StyledAvatar>
            <Typography component="h1" variant="h5">
              Reset Password
            </Typography>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              <StyledForm>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      variant="outlined"
                      fullWidth
                      id="password"
                      label="Password"
                      name="password"
                      as={TextField}
                      helperText={
                        <StyledErrorMessage name="password" component="div" />
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      variant="outlined"
                      fullWidth
                      name="confirmPassword"
                      label="Confirm Password"
                      type="confirmPassword"
                      id="confirmPassword"
                      as={TextField}
                      helperText={
                        <StyledErrorMessage
                          name="confirmPassword"
                          component="div"
                        />
                      }
                    />
                  </Grid>
                </Grid>
                <StyledButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Reset Password
                </StyledButton>
              </StyledForm>
            </Formik>
          </StyledPaper>
        </Box>
      </Container>
    </StyledRoot>
  );
};

export default ForgotPassword;
