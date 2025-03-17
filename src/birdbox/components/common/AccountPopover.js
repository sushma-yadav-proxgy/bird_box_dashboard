import { useRef, useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { Link as RouterLink, useNavigate } from "react-router-dom";
// Material-UI
import { alpha } from "@mui/material/styles";
import {
  Button,
  Card,
  Stack,
  Box,
  Divider,
  MenuItem,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAuth } from "../../../customContextProvider/AuthProvider";
import { encryptStorage } from "../../../CustomStorage";
import { APP_CONSTANTS } from "../../../URLConstants";
import MenuPopover from "./MenuPropover";

// Constants
const MENU_OPTIONS = [
  {
    label: "Profile",
    // icon: personFill,
    // linkTo: URL_CONSTANT.CONTROLCENTER,
  },
  {
    label: "Settings",
    // icon: settings2Fill,
    // linkTo: URL_CONSTANT.CONTROLCENTER,/
  },
];

const useStyles = makeStyles((theme) => ({
  menuItem: {
    fontSize: "14px",
    [theme.breakpoints.down("sm")]: {
      fontSize: "12px",
    },
    minHeight: "20px",
    borderRadius: "8px",
    marginInline: theme.spacing(1),
  },
}));

export default function AccountPopover() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { sessionUserData, logoutSession, logoutFromPHelmet, disConnectMqtt } =
    useAuth();

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const [decodedImage, setDecodedImage] = useState("");

  const signout = async () => {
    try {
      encryptStorage.setItem(
        APP_CONSTANTS.L_KEY_OF_USER_LOGGEDIN_STATUS,
        false
      );
      encryptStorage.removeItem(APP_CONSTANTS.L_KEY_OF_USER_DATA);
      encryptStorage.removeItem(APP_CONSTANTS.L_KEY_OF_USER_IOT_CLIENT_ID);
      encryptStorage.removeItem(APP_CONSTANTS.L_KEY_OF_USER_ADMIN_SSOTOKEN);
      logoutSession();
      // disConnectMqtt();
      navigate("/login", { replace: true });
      logoutFromPHelmet();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (sessionUserData?.user?.image) {
      const base64Image = `data:image/jpeg;base64,${sessionUserData.user.image}`;
      setDecodedImage(base64Image);
    }
  }, [sessionUserData?.user?.image]);

  return (
    <>
      {/* Desktop View */}
      <Card
        sx={{
          borderRadius: "10px",
          minWidth: "190px",
          p: 0.5,
          height: "50px",
          width: "100%",
          display: { xs: "none", lg: "flex" },
          cursor: "pointer",
          border: "none",
          boxShadow: "0px 10px 19px 1px #EAEAFF",
        }}
        onClick={handleOpen}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <IconButton
              ref={anchorRef}
              aria-label="user-avatar"
              sx={{
                padding: 0,
                width: 44,
                height: 44,
                ...(open && {
                  "&:before": {
                    zIndex: 1,
                    content: "''",
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    position: "absolute",
                    bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                  },
                }),
              }}
            >
              {/* <Avatar alt="photoURL" /> */}
              <Avatar alt="User Image" src={decodedImage || ""} />
            </IconButton>
            <Box sx={{ width: "100%", pl: 1 }}>
              <Typography
                sx={{
                  lineHeight: "17px",
                  fontWeight: 700,
                  fontSize: "14px",
                  textTransform: "capitalize",
                }}
              >
                {sessionUserData?.user?.name || "User Name"}
              </Typography>
              <Typography
                sx={{
                  lineHeight: "15px",
                  fontWeight: 400,
                  fontSize: "12px",
                  textTransform: "capitalize",
                }}
              >
                {sessionUserData?.user?.userRole?.roleName || "Role"}
              </Typography>
            </Box>
          </Box>
          <ExpandMoreIcon
            style={{ color: "#535353", display: "flex", justifyContent: "end" }}
          />
        </Stack>
      </Card>

      {/* Menu Popover */}
      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 220 }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap>
            {sessionUserData?.user?.name || "User Name"}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {sessionUserData?.user?.email || "user@example.com"}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem
            key={option.label}
            to={option.linkTo}
            component={RouterLink}
            onClick={handleClose}
            sx={{
              typography: "body2",
              py: 1,
              px: 2.5,
            }}
            className={classes.menuItem}
          >
            <Box
              //   component={Icon}
              icon={option.icon}
              sx={{
                mr: 2,
                width: 24,
                height: 24,
              }}
            />
            {option.label}
          </MenuItem>
        ))}

        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button
            onClick={signout}
            fullWidth
            color="inherit"
            variant="outlined"
          >
            Logout
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}
