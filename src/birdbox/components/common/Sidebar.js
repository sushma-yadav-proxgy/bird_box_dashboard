import PropTypes from "prop-types";
import { useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
// material
import { styled } from "@mui/material/styles";
import { Box, Drawer } from "@mui/material";
import Scrollbar from "./ScrollBar";
import sidebarConfig from "./SidebarConfig";
import NavSection from "./NavSection";

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 65;
const DRAWER_WIDTH_MOBILE = 0;

const RootStyle = styled("div")(({ theme }) => ({
  flexShrink: 0,
  [theme.breakpoints.up("sm")]: {
    width: DRAWER_WIDTH_MOBILE,
  },
  [theme.breakpoints.up("md")]: {
    width: DRAWER_WIDTH,
  },
}));
// ----------------------------------------------------------------------

Sidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default function Sidebar({
  isOpenSidebar,
  onCloseSidebar,
  setIsOpenSidebar,
}) {
  const { pathname } = useLocation();
  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: "100%",
        "& .simplebar-content": {
          height: "100%",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box sx={{ px: 2, py: 3 }}>
        <Box component={RouterLink} to="/" sx={{ display: "inline-flex" }}>
          <Box
            component="img"
            src="https://www.proxgy.com/assets/logo.png"
            sx={{ width: "30px" }}
          />
        </Box>
      </Box>
      <NavSection navConfig={sidebarConfig} />
    </Scrollbar>
  );

  return (
    <RootStyle>
      <Drawer
        open
        variant="permanent"
        PaperProps={{
          sx: {
            width: DRAWER_WIDTH,
            display: { xs: "none", md: "block" },
            height: { xs: "calc(100% - 20px)", sm: "calc(100% - 40px)" },
            backgroundColor: "#FFFFFF",
            top: { xs: 10, sm: 20 },
            left: { xs: 10, sm: 20 },
            borderRadius: "20px",
            boxShadow: "0px 10px 19px 1px #EAEAFF",
            transition: "width 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
            "&:hover": {
              width: 225,
            },
          },
        }}
      >
        {renderContent}
      </Drawer>
    </RootStyle>
  );
}
