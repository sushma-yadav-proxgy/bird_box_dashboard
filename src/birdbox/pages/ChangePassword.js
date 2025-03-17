import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Alert,
  Box,
  Button,
  Card,
  IconButton,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik, Form, FormikProvider } from "formik";
import Page from "../components/common/Page";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import loginPageImage from "../../images/birdbox.png";
import { URL_CONSTANT } from "../../URLConstants";

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

const ChangePasswordValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email must be a valid email address")
    .required("Email is required"),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New Password is required"),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function ChangePassword() {
  const navigate = useNavigate();
  const { otp } = useParams();

  const [showPassword, setShowPassword] = useState(false);

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

  const changePasswordFormik = useFormik({
    initialValues: {
      email: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: ChangePasswordValidationSchema,
    onSubmit: (values, { resetForm }) => {
      ChangePassword(values);
      resetForm();
    },
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } =
    changePasswordFormik;

  const ChangePassword = (value) => {
    // SmartLockApiCallerInstance({
    //   method: "POST",
    //   url: SMART_LOCK_API_ENDPOINTS.RESET_PASSWORD,
    //   data: {
    //     email: value?.email,
    //     newPassword: value?.confirmNewPassword,
    //     otp,
    //   },
    // })
    //   .then((res) => {
    //     changePasswordFormik.setSubmitting(false);
    //     setAlertMetas({
    //       ...alertMetas,
    //       severity: "success",
    //       snackBarOpened: true,
    //       msg: res?.data?.data?.message,
    //     });
    //     setTimeout(() => {
    //       setAlertMetas({ ...alertMetas, snackBarOpened: false, msg: "" });
    //       navigate("/login");
    //     }, 4000);
    //   })
    //   .catch((err) => {
    //     changePasswordFormik.setSubmitting(false);
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
    <RootStyle title="Change Password">
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
            Change Password
          </Typography>

          <FormikProvider value={changePasswordFormik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  {...getFieldProps("email")}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                />
                <TextField
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  label="New Password"
                  {...getFieldProps("newPassword")}
                  error={Boolean(touched.newPassword && errors.newPassword)}
                  helperText={touched.newPassword && errors.newPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  label="Confirm New Password"
                  {...getFieldProps("confirmNewPassword")}
                  error={Boolean(
                    touched.confirmNewPassword && errors.confirmNewPassword
                  )}
                  helperText={
                    touched.confirmNewPassword && errors.confirmNewPassword
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>

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
                  onClick={() => navigate(URL_CONSTANT.FORGOT_PASSWORD)}
                >
                  Back
                </Button>
                <Button
                  size="medium"
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  sx={{ boxShadow: "none" }}
                >
                  Confirm
                </Button>
              </Box>
            </Form>
          </FormikProvider>
        </Card>
      </Box>
    </RootStyle>
  );
}
