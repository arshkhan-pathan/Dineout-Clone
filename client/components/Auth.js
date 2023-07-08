// packages
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MuiLink from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { styled, useMediaQuery, Box } from "@mui/material";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Image from "next/image";
// images
import illustrationImage from "../assets/images/rest.gif";
import axios from "axios";
import { toast } from "react-hot-toast";
import dineoutLogo from "../assets/images/dineout_logo.webp";
import { useRouter } from "next/router";
import useToggle from "@/hooks/useToggle";
import Modal from "@/components/Modal";
import ForgotPassword from "@/layouts/user/navbar/Form";

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

const Auth = ({
  initialValues,
  validationSchema,
  onSubmit,
  authType = "Sign In",
}) => {
  const isDesktop = useMediaQuery("(min-width: 1000px)");
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useToggle();

  const onSendEmail = (values) => {
    const get = axios
      .post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/users/reset_password/`, {
        email: values.email,
      })
      .then(function (response) {
        //
        onClose();
      })
      .catch(function (error) {
        //
      });
    toast.promise(get, {
      loading: "Wait Chef is Sending You Reset Link",
      success: "Please Check Your Mail For Resting Password",
      error: "Error when fetching",
    });
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
            Hi, Welcome Back
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
              {authType}
            </Typography>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              <StyledForm>
                <Grid container spacing={2}>
                  {authType === "Sign Up" && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Field
                          name="first_name"
                          variant="outlined"
                          fullWidth
                          id="first_name"
                          label="Name"
                          autoFocus
                          as={TextField}
                          helperText={
                            <StyledErrorMessage
                              name="first_name"
                              component="div"
                            />
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field
                          variant="outlined"
                          fullWidth
                          id="city"
                          label="City"
                          name="city"
                          as={TextField}
                          helperText={
                            <StyledErrorMessage name="city" component="div" />
                          }
                        />
                      </Grid>
                    </>
                  )}
                  <Grid item xs={12}>
                    <Field
                      variant="outlined"
                      fullWidth
                      id="email"
                      label="Email"
                      name="email"
                      autoComplete="email"
                      as={TextField}
                      helperText={
                        <StyledErrorMessage name="email" component="div" />
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      variant="outlined"
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      as={TextField}
                      helperText={
                        <StyledErrorMessage name="password" component="div" />
                      }
                    />
                  </Grid>
                  {authType === "Sign Up" && (
                    <Grid item xs={12}>
                      <Field
                        variant="outlined"
                        fullWidth
                        name="confirmPassword"
                        label="confirmPassword"
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
                  )}
                </Grid>
                <StyledButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  {authType}
                </StyledButton>
                <Grid container justify="flex-end">
                  <Grid item>
                    {authType === "Sign Up" && (
                      <MuiLink
                        href="/restaurant/login"
                        component={Link}
                        variant="body2"
                      >
                        Already have an account? Sign in
                      </MuiLink>
                    )}

                    {authType === "Sign In" && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <MuiLink
                          href="/restaurant/register"
                          component={Link}
                          variant="body2"
                        >
                          Don&apos;t have an account? Sign up
                        </MuiLink>
                        <Button
                          style={{ textTransform: "none", marginLeft: "-80px" }}
                          onClick={onOpen}
                        >
                          Forgot Password?
                        </Button>
                      </div>
                    )}
                  </Grid>
                </Grid>
              </StyledForm>
            </Formik>
          </StyledPaper>
          {isOpen && (
            <Modal isOpen={isOpen} onClose={onClose}>
              <ForgotPassword
                title={"Forgot Password"}
                onSubmit={onSendEmail}
              ></ForgotPassword>
            </Modal>
          )}
        </Box>
      </Container>
    </StyledRoot>
  );
};

export default Auth;
