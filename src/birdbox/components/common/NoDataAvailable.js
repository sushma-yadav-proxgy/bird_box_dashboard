import { Box, Typography } from "@mui/material";
import React from "react";
import { ReactComponent as NotFoundIcon } from "../../../icons/noDataIcon.svg";

export default function NoDataAvailable() {
  return (
    <Box
      style={{
        minHeight: "200px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <NotFoundIcon />
      <Typography
        sx={{
          color: "#B0B9C7",
          fontSize: { xs: "14px", sm: "16px" },
          fontWeight: "bold",
          marginTop: "5px",
        }}
      >
        No Data available yet
      </Typography>
    </Box>
  );
}
