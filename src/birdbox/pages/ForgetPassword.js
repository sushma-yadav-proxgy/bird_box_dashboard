import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Alert,
  Box,
  Button,
  Card,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { Formik, Form, useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Page from "../components/common/Page";
import loginPageImage from "../../images/birdbox.png";
import { URL_CONSTANT } from "../../URLConstants";

// Styles for the root container
const RootStyle = styled(Page)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  width: "100% !important",
  backgroundImage: `url(${loginPageImage})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "50% 50%",
}));

// Validation schema using Yup
const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

export default function ForgetPassword() {
  const navigate = useNavigate();

  const [alertMetas, setAlertMetas] = useState({
    snackBarOpened: false,
    vertical: "top",
    horizontal: "right",
    msg: "",
    variant: "filled",
    severity: "",
  });

  const vertical = "bottom";
  const horizontal = "left";

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertMetas({ ...alertMetas, snackBarOpened: false });
  };

  const forgortPasswordFormik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: ForgotPasswordSchema,
    onSubmit: () => {
      generateOtp(forgortPasswordFormik.values.email);
    },
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } =
    forgortPasswordFormik;

  // Function to handle OTP generation
  const generateOtp = (email) => {
    // SmartLockApiCallerInstance({
    //   method: "POST",
    //   url: SMART_LOCK_API_ENDPOINTS.GENERATE_OTP,
    //   data: {
    //     email,
    //   },
    // })
    //   .then((res) => {
    //     forgortPasswordFormik.setSubmitting(false);
    //     setAlertMetas({
    //       ...alertMetas,
    //       severity: res.data.data?.error ? "error" : "success",
    //       snackBarOpened: true,
    //       msg: res.data.data?.error
    //         ? res.data.data?.error
    //         : res?.data?.data?.message,
    //     });
    //     setTimeout(
    //       () =>
    //         setAlertMetas({ ...alertMetas, snackBarOpened: false, msg: "" }),
    //       4000
    //     );
    //   })
    //   .catch((err) => {
    //     forgortPasswordFormik.setSubmitting(false);
    //     setAlertMetas({
    //       ...alertMetas,
    //       severity: "error",
    //       snackBarOpened: true,
    //       msg: err?.response?.data?.message,
    //     });
    //     setTimeout(
    //       () =>
    //         setAlertMetas({ ...alertMetas, snackBarOpened: false, msg: "" }),
    //       4000
    //     );
    //   });
  };

  return (
    <RootStyle title="Forgot Password">
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={alertMetas?.snackBarOpened}
        onClose={handleSnackBarClose}
        autoHideDuration={6000}
      >
        <Alert variant={alertMetas?.variant} severity={alertMetas?.severity}>
          {alertMetas?.msg}
        </Alert>
      </Snackbar>
      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "center", md: "flex-end" },
          alignItems: "center",
          minWidth: { xs: "100%", md: "60%" },
          gap: "100px",
        }}
      >
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "20px",
            gap: "30px",
            minWidth: { xs: "90%", md: "40%" },
            backgroundColor: "#F8FAFB",
          }}
        >
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: "700",
              lineHeight: "20px",
              textAlign: "left",
            }}
          >
            Receive OTP via
          </Typography>

          {/* Formik setup */}
          <Formik value={forgortPasswordFormik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <TextField
                label="Registered Email ID"
                name="email"
                fullWidth
                {...getFieldProps("email")}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  mt: 2,
                }}
              >
                <Button
                  size="medium"
                  variant="outlined"
                  onClick={() => navigate(URL_CONSTANT.LOGIN)}
                >
                  Back
                </Button>
                <Button
                  size="medium"
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  Send OTP
                </Button>
              </Box>
            </Form>
          </Formik>
        </Card>
      </Box>
    </RootStyle>
  );
}
