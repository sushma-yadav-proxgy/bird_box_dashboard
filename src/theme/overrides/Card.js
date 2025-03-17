// ----------------------------------------------------------------------

export default function Card(theme) {
  return {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 10px 19px 1px #EAEAFF',
          borderRadius: theme.shape.borderRadiusMd,
          position: 'relative',
          backgroundColor: '#FFFFFF',
          zIndex: 0 // Fix Safari overflow: hidden with border radius
        }
      }
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: { variant: 'h6' },
        subheaderTypographyProps: { variant: 'body2' }
      },
      styleOverrides: {
        root: {
          padding: theme.spacing(3, 3, 0)
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: theme.spacing(3)
        }
      }
    }
  };
}
