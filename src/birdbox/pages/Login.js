import { Alert, Box, Card, Snackbar, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Page from "../components/common/Page";
import { useState } from "react";
import LoginForm from "../components/LoginForm";
import loginPageImage from "../../images/birdbox.png";

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

export default function Login() {
  const [alertMetas, setAlertMetas] = useState({
    snackBarOpened: false,
    vertical: "top",
    horizontal: "center",
    msg: "",
    variant: "filled",
    severity: "",
  });

  const vertical = "top";
  const horizontal = "center";

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertMetas({ ...alertMetas, snackBarOpened: false });
  };
  return (
    <RootStyle title="Login">
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
            height: "100%",
            borderRadius: "10px",
            backgroundColor: "#F8FAFB !important",
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
            Log In
          </Typography>
          <LoginForm alertMetas={alertMetas} setAlertMetas={setAlertMetas} />
        </Card>
      </Box>
    </RootStyle>
  );
}
