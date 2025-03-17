export default function Backdrop(theme) {
  return {
    MuiBackdrop: {
      styleOverrides: {
        root: {
          background: "#000",
          opacity: "0.7 !important",
          "&.MuiBackdrop-invisible": {
            background: "transparent",
          },
        },
      },
    },
  };
}
