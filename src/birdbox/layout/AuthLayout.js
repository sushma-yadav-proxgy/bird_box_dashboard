import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Alert, Box, Button, Snackbar, Stack } from "@mui/material";
import Sidebar from "../components/common/Sidebar";
import Notification from "../components/common/Notification";
import AccountPopover from "../components/common/AccountPopover";
import { useAuth } from "../../customContextProvider/AuthProvider";
import { URL_CONSTANT } from "../../URLConstants";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

const RootStyle = styled("div")(({ theme }) => ({
  display: "flex",
  minHeight: "100vh",
  overflow: "hidden",
  padding: "20px",
  backgroundColor: "#F8FAFB",
  [theme.breakpoints.down("md")]: {
    padding: "10px",
  },
}));

const MainStyle = styled("div")(({ theme }) => ({
  flexGrow: 1,
  overflow: "auto",
  minHeight: "100%",
  width: "calc(100% - 320px)",
}));

const NotificationContainer = styled("Box")(({ theme }) => ({
  width: "320px",
  minWidth: "320px",
  maxWidth: "320px",
  display: "block",
  height: "calc(100vh - 40px)",
  position: "fixed",
  right: "20px",
  [theme.breakpoints.down("lg")]: {
    display: "none",
  },
}));

export default function AuthLayout() {
  const { sessionUserData } = useAuth();
  const location = useLocation();

  const isDashboard = location?.pathname === URL_CONSTANT.DASHBOARD;
  const role = sessionUserData?.user?.userRole?.roleName;

  const [open, setOpen] = useState(false);
  const [driverDetails, setDriverDetails] = useState(null);
  const [isDriverDetailModal, setIsDriverDetailModal] = useState(false);
  const [isHelpDrawer, setIsHelpDrawer] = useState(false);
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

  return (
    <RootStyle>
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
      <Sidebar
        isOpenSidebar={open}
        onCloseSidebar={() => setOpen(false)}
        setIsOpenSidebar={setOpen}
      />
      <MainStyle>
        <Outlet />
      </MainStyle>

      <NotificationContainer>
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            justifyContent: "flex-end",
            mb: 2,
            height: "50px",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            width="100%"
            spacing={{ xs: 0.5, sm: 1.5 }}
          >
            <AccountPopover />
          </Stack>
          {isDashboard && role?.toUpperCase() !== "SUPERADMIN" && (
            <Stack direction="row" height="100%" spacing={{ xs: 0.5, sm: 1.5 }}>
              <Button
                variant="outlined"
                size="large"
                startIcon={<HelpOutlineOutlinedIcon />}
                // onClick={() => setIsHelpDrawer(true)}
                sx={{
                  boxShadow: "0px 10px 19px 1px #EAEAFF",
                  backgroundColor: "#FFFFFF",
                  border: "none",
                }}
              >
                Help
              </Button>
            </Stack>
          )}
        </Box>

        <Notification
          setDriverDetails={setDriverDetails}
          setAlertMetas={setAlertMetas}
          alertMetas={alertMetas}
          setIsDriverDetailModal={setIsDriverDetailModal}
        />
      </NotificationContainer>
    </RootStyle>
  );
}
