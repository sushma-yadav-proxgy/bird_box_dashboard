import PropTypes from 'prop-types';
import { useMemo } from 'react';
// material
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
//
import shape from './shape';
import palette from './palette';
import typography from './typography';
import componentsOverride from './overrides';
import shadows, { customShadows } from './shadows';

// ----------------------------------------------------------------------

ThemeConfig.propTypes = {
  children: PropTypes.node
};

export default function ThemeConfig({ children }) {
  const themeOptions = useMemo(
    () => ({
      palette,
      shape,
      typography,
      shadows,
      customShadows
    }),
    []
  );

  const theme = createTheme(themeOptions);

  theme.components = {
    ...componentsOverride(theme),
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none'
          }
        },
        outlined: {
          borderColor: '#EAE9EE',
          '&:hover': {
            borderColor: '#EAE9EE'
          }
        }
      }
    },
    MuiLoadingButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none'
          }
        }
      }
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiAlert-colorSuccess': {
            backgroundColor: '#C6FFCF'
          },
          '& .MuiAlert-colorError': {
            backgroundColor: '#FFCACA'
          },
          '& .MuiAlert-colorInfo': {
            backgroundColor: '#FFEACA'
          },
          '& .MuiAlert-colorWarning': {
            backgroundColor: '#FFF3E0'
          },
          '& .MuiAlert-root': {
            color: '#171D40',
            borderRadius: theme.shape.borderRadius,
            boxShadow: 'none'
          }
        }
      }
    }
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
