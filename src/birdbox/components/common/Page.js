import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";
import { forwardRef } from "react";
import { Box } from "@mui/material";

// ----------------------------------------------------------------------

const Page = forwardRef(({ children, title = "", ...other }, ref) => (
  <Box
    ref={ref}
    {...other}
    sx={{
      paddingLeft: { xs: 1, md: 2 },
      paddingRight: { xs: 1, md: 2 },
      height: "100%",
      width: { xs: "100%", lg: "calc(100% - 320px)" },
    }}
  >
    <Helmet>
      <title>{title}</title>
    </Helmet>
    {children}
  </Box>
));

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};

export default Page;
