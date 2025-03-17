// material
import { useTheme } from '@mui/material/styles';
import { GlobalStyles as GlobalThemeStyles } from '@mui/material';

// ----------------------------------------------------------------------

export default function GlobalStyles() {
  const theme = useTheme();

  return (
    <GlobalThemeStyles
      styles={{
        '*': {
          margin: 0,
          padding: 0,
          boxSizing: 'border-box'
        },
        html: {
          width: '100%',
          height: '100%',
          WebkitOverflowScrolling: 'touch'
        },
        body: {
          width: '100%',
          height: '100%',
          backgroundColor: '#F8FAFB'
        },
        '#root': {
          width: '100%',
          height: '100%'
        },
        input: {
          '&[type=number]': {
            MozAppearance: 'textfield',
            '&::-webkit-outer-spin-button': {
              margin: 0,
              WebkitAppearance: 'none'
            },
            '&::-webkit-inner-spin-button': {
              margin: 0,
              WebkitAppearance: 'none'
            }
          }
        },
        textarea: {
          '&::-webkit-input-placeholder': {
            color: theme.palette.text.disabled
          },
          '&::-moz-placeholder': {
            opacity: 1,
            color: theme.palette.text.disabled
          },
          '&:-ms-input-placeholder': {
            color: theme.palette.text.disabled
          },
          '&::placeholder': {
            color: theme.palette.text.disabled
          }
        },
        img: {
          display: 'block',
          maxWidth: '100%'
        },
        '.no_record_found_image': {
          width: '200px',
          height: 'auto',
          margin: '0 auto'
        },
        '.blur-up': {
          WebkitFilter: 'blur(5px)',
          filter: 'blur(5px)',
          transition: 'filter 400ms, -webkit-filter 400ms'
        },
        '.blur-up.lazyloaded': {
          WebkitFilter: 'blur(0)',
          filter: 'blur(0)'
        },
        '.cardWithBorder': {
          boxShadow: 'none',
          border: '1px solid rgba(145, 158, 171, 0.24)'
        },
        '.pac-container': {
          zIndex: 1000000 // for Google Autocomplete
        },
        '.actionButtons': {
          border: '1px solid #EAE9EE',
          borderRadius: '10px',
          boxShadow: '0px 10px 19px 1px #EAEAFF',
          color: '#171D40'
        },
        ' .css-20dzk0-MuiContainer-root': {
          padding: 0
        },
        /* Scrollbar Customization */
        '::-webkit-scrollbar': {
          width: '6px',
          height: '6px' // Adjust the width of the scrollbar
        },
        '::-webkit-scrollbar-track': {
          boxShadow: 'inset 0 0 5px #ffffff',
          borderRadius: '10px'
        },
        '::-webkit-scrollbar-thumb': {
          background: '#E7EAEE',
          borderRadius: '10px'
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: '#E7EAEE' // Darker color when hovering over the scrollbar thumb
        }
      }}
    />
  );
}
