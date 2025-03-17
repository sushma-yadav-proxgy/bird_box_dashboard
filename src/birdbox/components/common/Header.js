import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
// material
import { alpha, styled } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

import {
  Box,
  Stack,
  FormControl,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  Typography,
  Card,
  AppBar,
  IconButton,
  InputBase,
  Drawer,
  useMediaQuery,
  useTheme
} from '@mui/material';

import SvgIcon from '@mui/material/SvgIcon';

import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import { URL_CONSTANT } from '../../../URLConstants';
import { HeaderHeight, HeaderHeightMobile } from '../../../constants/Constant';
import { useAuth } from '../../../customContextProvider/AuthProvider';
import Notification from './Notification';
import { ReactComponent as BirdIcon } from '../../../icons/birdIcon.svg';

// ----------------------------------------------------------------------

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // For Safari support
  backgroundColor: 'transparent', // Slight transparency
  position: 'sticky', // Sticky positioning
  top: 0, // Sticks to the top of the screen
  zIndex: theme.zIndex.appBar, // Ensures it stays above other content
  height: HeaderHeight,
  [theme.breakpoints.down('md')]: {
    height: HeaderHeightMobile
  }
}));

const useStyles = makeStyles((theme) => ({
  menuItem: {
    fontSize: '14px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px'
    },
    minHeight: '20px',
    borderRadius: '8px',
    marginInline: theme.spacing(1)
  }
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25)
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: '100%'
  }
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '100%',
      '&:focus': {
        width: '100%'
      }
    }
  }
}));

// ----------------------------------------------------------------------

Header.propTypes = {
  onOpenSidebar: PropTypes.func
};

export default function Header({
  // onOpenSidebar,
  handleSearch,
  handleSubmit,
  name,
  showSearch,
  setHelpDrawer
}) {
  const classes = useStyles();
  const location = useLocation();
  const theme = useTheme();

  const isDashboard = location?.pathname === URL_CONSTANT.BIRD_BOX;

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const { sessionUserData } = useAuth();

  const role = sessionUserData?.user?.userRole?.roleName;

  const [selectProxgyProductType, setSelectProxgyProductType] = useState('surveillance');
  const [open, setOpen] = useState(false);
  const [driverDetails, setDriverDetails] = useState(null);
  const [isDriverDetailModal, setIsDriverDetailModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [alertMetas, setAlertMetas] = useState({
    snackBarOpened: false,
    vertical: 'bottom',
    horizontal: 'right',
    msg: '',
    variant: 'filled',
    severity: 'info'
  });

  const vertical = 'bottom';
  const horizontal = 'right';

  const handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertMetas({ ...alertMetas, snackBarOpened: false });
  };

  const toggleDrawer = () => {
    setOpen(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleProductChangeForDashboard = (value) => {
    setSelectProxgyProductType(value);
    if (value !== 'surveillance') {
      setAlertMetas({
        ...alertMetas,
        severity: 'info',
        snackBarOpened: true,
        msg: 'This feature is coming soon !'
      });
      setTimeout(() => setAlertMetas({ ...alertMetas, snackBarOpened: false, msg: '' }), 10000);
    }
  };

  return (
    <RootStyle>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={alertMetas?.snackBarOpened}
        onClose={handleSnackBarClose}
        autoHideDuration={6000}
        sx={{ top: 30, botton: 30 }}
      >
        <Alert
          variant={alertMetas?.variant}
          severity={alertMetas?.severity}
          sx={{ fontSize: { xs: 12, sm: 14 } }}
        >
          {alertMetas?.msg}
        </Alert>
      </Snackbar>

      <Stack direction="row" spacing={2} sx={{ width: '100%', height: '50px' }} alignItems="center">
        <Box
          sx={{
            display: { xs: 'block', md: 'none' },
            marginRight: '16px !important'
          }}
        >
          <IconButton
            aria-label="Notification"
            sx={{ padding: 0 }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon color="primary" sx={{ fontSize: { xs: '20px', sm: '20px' } }} />
          </IconButton>
        </Box>

        {isDashboard && (
          <Box
            sx={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              marginLeft: '0 !important',
              marginRight: '16px !important'
            }}
          >
            <FormControl
              sx={{
                m: 0,
                minWidth: { xs: 30, sm: 130 },
                height: '45px',
                boxShadow: '0px 10px 19px 1px #EAEAFF',
                border: 'none',
                borderRadius: '10px',
                backgroundColor: '#ffffff'
              }}
            >
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                IconComponent={ExpandMoreIcon}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '45px',
                  fontFamily: 'Mulish',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  fontSize: { xs: 0, sm: '12px' },
                  border: 'none',
                  boxShadow: 'none',
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                    gap: { xs: 0, sm: '8px' }
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  }
                }}
                onChange={(e) => handleProductChangeForDashboard(e.target.value)}
                value={selectProxgyProductType}
              >
                <MenuItem
                  value="surveillance"
                  sx={{
                    p: 1,
                    fontFamily: 'Mulish',
                    fontStyle: 'normal',
                    fontWeight: 700,
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    justifyContent: { xs: 'center', sm: 'flex-start' }
                  }}
                  className={classes.menuItem}
                >
                  <BirdIcon />
                  <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Birdbox</Box>
                </MenuItem>
                <MenuItem
                  value="logistics"
                  sx={{
                    p: 1,
                    fontFamily: 'Mulish',
                    fontStyle: 'normal',
                    fontWeight: 700,
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    justifyContent: { xs: 'center', sm: 'flex-start' }
                  }}
                  className={classes.menuItem}
                >
                  <SvgIcon>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_401_29718)">
                        <path
                          d="M11.9952 20.4689C10.2749 20.4689 8.55454 20.4689 6.83423 20.4689C6.6337 20.4689 6.44825 20.4262 6.2824 20.3086C6.09846 20.1758 6.01553 19.9881 6.00045 19.7667C5.99292 19.6645 5.99744 19.5607 5.99744 19.4584C5.99744 17.593 6.00196 15.7276 5.99744 13.8622C5.99442 12.8776 6.36382 12.0686 7.08753 11.4213C7.15085 11.3648 7.17347 11.3099 7.17347 11.2275C7.17347 10.3039 7.17799 9.37885 7.17799 8.45532C7.17799 7.23106 7.58206 6.15945 8.35251 5.2237C8.62541 4.89245 8.95862 4.63294 9.30238 4.38565C9.86024 3.98418 10.4844 3.74452 11.1569 3.62698C11.4826 3.57049 11.8097 3.50791 12.1429 3.53996C12.743 3.59797 13.3371 3.69719 13.8949 3.93533C14.4332 4.16431 14.9021 4.50777 15.3242 4.91229C15.9907 5.55037 16.4415 6.32431 16.6556 7.22648C16.7641 7.6829 16.8229 8.15002 16.8184 8.62476C16.8078 9.47808 16.8139 10.3314 16.8124 11.1847C16.8124 11.2794 16.8244 11.3648 16.9058 11.429C17.334 11.7678 17.5994 12.2166 17.7909 12.7234C17.9326 13.099 17.9959 13.4806 17.9959 13.8775C17.9959 15.8222 17.9959 17.767 17.9959 19.7118C17.9959 20.072 17.8271 20.3086 17.4863 20.414C17.3747 20.4476 17.2541 20.4689 17.138 20.4689C15.4237 20.472 13.7095 20.472 11.9952 20.472V20.4689ZM16.5937 19.031C16.5953 18.9958 16.5983 18.9699 16.5983 18.9439C16.5983 17.2373 16.5983 15.5307 16.5953 13.8256C16.5953 13.7004 16.5817 13.5722 16.5545 13.45C16.3781 12.6456 15.7223 12.1113 14.8885 12.1082C12.9601 12.1021 11.0302 12.1006 9.10185 12.1082C8.12937 12.1113 7.39812 12.8669 7.39661 13.8515C7.3951 15.5429 7.39661 17.2343 7.39661 18.9256C7.39661 18.9592 7.39661 18.9928 7.39661 19.031H16.5953H16.5937ZM15.4207 10.7176C15.4207 10.6886 15.4207 10.6596 15.4207 10.6306C15.4207 9.94214 15.4177 9.25368 15.4207 8.56523C15.4268 7.64474 15.1403 6.82959 14.5447 6.13808C13.9251 5.41757 13.129 5.02526 12.1912 4.97488C11.1539 4.91993 10.2598 5.27866 9.53155 6.03733C8.92997 6.66472 8.62842 7.43256 8.58621 8.29198C8.54851 9.0705 8.57113 9.85054 8.56811 10.6306C8.56811 10.6611 8.57113 10.6917 8.57264 10.7176H15.4207Z"
                          fill="#171D40"
                        />
                        <path
                          d="M15.2131 16.5627C15.1739 16.5352 15.1513 16.5046 15.1226 16.4985C14.8437 16.436 14.6673 16.2604 14.5889 15.9887C14.3854 15.2865 13.9195 14.827 13.2742 14.54C12.6741 14.2729 12.0529 14.221 11.4076 14.3309C10.8965 14.4179 10.4547 14.6393 10.0597 14.9644C9.7868 15.1903 9.59381 15.4773 9.47772 15.8162C9.41892 15.9902 9.36765 16.1658 9.23196 16.3062C8.99524 16.552 8.64394 16.5489 8.42683 16.4421C8.15996 16.3108 7.99713 15.9917 8.05442 15.6895C8.14338 15.2254 8.34994 14.8148 8.62887 14.4378C9.07365 13.8363 9.66769 13.4409 10.3447 13.1555C11.0352 12.8624 11.7574 12.8029 12.4886 12.8761C13.4008 12.9662 14.2271 13.299 14.9086 13.931C15.3609 14.3523 15.7167 14.853 15.8991 15.4605C15.9534 15.6406 15.9775 15.8223 15.9263 16.007C15.872 16.2024 15.7589 16.3489 15.572 16.4268C15.4513 16.4772 15.3277 16.5199 15.2146 16.5611L15.2131 16.5627Z"
                          fill="#171D40"
                        />
                        <path
                          d="M9.67578 16.6895C9.69086 16.6208 9.6984 16.5338 9.72855 16.4559C10.0814 15.5629 10.7267 15.0317 11.669 14.9095C12.7772 14.7661 13.7858 15.4102 14.1583 16.4666C14.2834 16.8223 14.1341 17.21 13.813 17.3626C13.5657 17.4802 13.2868 17.4145 13.1194 17.1917C13.0667 17.1215 13.0184 17.0467 12.9852 16.9658C12.8315 16.607 12.5586 16.404 12.1861 16.3292C11.8273 16.2575 11.5001 16.3338 11.2061 16.5536C11.0448 16.6742 10.9498 16.8467 10.8699 17.0283C10.7885 17.2085 10.6618 17.3397 10.4704 17.3962C10.1311 17.4954 9.78886 17.2695 9.70443 16.8894C9.69086 16.8299 9.68634 16.7673 9.67578 16.6895Z"
                          fill="#171D40"
                        />
                        <path
                          d="M12.5449 17.6418C12.5419 18.0035 12.2328 18.3134 11.88 18.3104C11.5287 18.3073 11.2212 17.9883 11.2227 17.6311C11.2242 17.283 11.5408 16.9716 11.8906 16.9732C12.2389 16.9747 12.5495 17.2922 12.5464 17.6418H12.5449Z"
                          fill="#171D40"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_401_29718">
                          <rect
                            width="12"
                            height="16.9412"
                            fill="white"
                            transform="translate(6 3.5293)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </SvgIcon>
                  <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Logistics</Box>
                </MenuItem>
                <MenuItem
                  value="wearables"
                  sx={{
                    p: 1,
                    fontFamily: 'Mulish',
                    fontStyle: 'normal',
                    fontWeight: 700,
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    justifyContent: { xs: 'center', sm: 'flex-start' }
                  }}
                  className={classes.menuItem}
                >
                  <SvgIcon>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_401_29726)">
                        <path
                          d="M18.9765 15.3811C14.3041 14.5705 9.65246 14.5732 5.00474 15.3878C4.74588 13.5285 5.07759 11.8482 6.22488 10.2353C6.27301 10.6149 6.30813 10.8855 6.34065 11.1575C6.43821 12.003 7.07039 12.6143 7.80013 12.5672C8.52988 12.52 9.11133 11.8293 9.07751 10.9758C9.04759 10.2366 8.96434 9.50014 8.87979 8.76502C8.77573 7.86161 8.78873 7.82391 9.63555 7.55195C9.77863 7.50617 9.92302 7.46174 10.2651 7.35538C10.2651 8.7731 10.2638 10.106 10.2664 11.4389C10.2664 11.7082 10.2547 11.9801 10.2872 12.2467C10.3965 13.1717 11.1367 13.8866 11.9796 13.9027C12.8381 13.9203 13.6121 13.2565 13.6797 12.2912C13.7747 10.9502 13.7655 9.60111 13.7994 8.25475C13.8059 7.99086 13.8007 7.72698 13.8007 7.34326C14.3262 7.54387 14.7594 7.70947 15.1847 7.87238C15.1028 8.89427 15.0013 9.85019 14.9545 10.8101C14.9037 11.8388 15.4449 12.5443 16.2435 12.5685C17.0435 12.5927 17.6419 11.9142 17.6965 10.9206C17.7069 10.7415 17.7186 10.5624 17.7343 10.3834C17.7356 10.3726 17.7681 10.3632 17.8396 10.3255C18.9141 11.8347 19.2666 13.5096 18.9765 15.3811Z"
                          fill="#171D40"
                        />
                        <path
                          d="M12.0244 15.3638C14.5675 15.6882 17.0754 15.9939 19.5781 16.3399C20.2844 16.4382 20.5888 16.8623 20.4782 17.3927C20.3625 17.9447 19.8916 18.1669 19.1892 18.0269C14.3945 17.0683 9.59715 17.0696 4.80245 18.0309C4.09612 18.1723 3.62003 17.9461 3.51727 17.3941C3.41971 16.869 3.7371 16.4341 4.42912 16.3385C6.95655 15.9912 9.48789 15.6856 12.0244 15.3638Z"
                          fill="#171D40"
                        />
                        <path
                          d="M10.9329 9.47079C10.9329 8.68855 10.9264 7.90497 10.9342 7.12273C10.942 6.40377 11.3531 5.94197 11.9761 5.92851C12.6343 5.91504 13.0701 6.38358 13.0623 7.14293C13.0467 8.71009 13.0194 10.2759 12.9829 11.8417C12.9647 12.6145 12.5641 13.1006 11.9917 13.0925C11.4142 13.0844 11.0838 12.6119 11.0461 11.8202C10.9329 9.47079 11.0461 11.8215 10.9329 9.47079C10.9693 9.47079 10.8952 9.47079 10.9329 9.47079Z"
                          fill="#171D40"
                        />
                        <path
                          d="M8.32799 10.4725C8.32799 10.7836 8.37612 10.9478 8.31888 11.0461C8.16929 11.3019 7.99108 11.7045 7.79336 11.7233C7.57223 11.7449 7.14037 11.4419 7.10785 11.2292C6.95826 10.2639 6.88411 9.28235 6.8672 8.30489C6.8646 8.11371 7.23402 7.77039 7.44345 7.76096C7.65028 7.75154 8.0171 8.04505 8.05872 8.26046C8.21222 9.0427 8.26035 9.84783 8.32799 10.4725Z"
                          fill="#171D40"
                        />
                        <path
                          d="M17.1699 8.4826C17.0867 9.41159 17.0125 10.2329 16.9384 11.0542C16.8994 11.4877 16.7094 11.7973 16.2516 11.7623C15.7482 11.7233 15.6337 11.3329 15.6649 10.8953C15.7221 10.0942 15.8067 9.2958 15.8743 8.49606C15.9134 8.0383 16.0942 7.71652 16.582 7.72325C16.9826 7.72863 17.1816 8.04368 17.1699 8.4826Z"
                          fill="#171D40"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_401_29726">
                          <rect
                            width="17"
                            height="12.1429"
                            fill="white"
                            transform="translate(3.5 5.92871)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </SvgIcon>
                  <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Wearables</Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}

        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: '#171D40',
            whiteSpace: 'nowrap',
            fontSize: { xs: '16px', sm: '20px', lg: '24px' },
            margin: '0 !important'
          }}
        >
          {name}
        </Typography>

        {showSearch && (
          <Card
            sx={{
              width: '100%',
              maxWidth: '100%',
              height: '100%',
              textAlign: 'center',
              justifyContent: 'space-between',
              alignItems: 'center',
              display: { xs: 'none', md: 'flex' }
            }}
          >
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>

              <StyledInputBase
                placeholder="Search here..."
                inputProps={{ 'aria-label': 'search' }}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={handleKeyPress}
                data-testid="search-holder"
              />
            </Search>
          </Card>
        )}

        <Box
          sx={{
            marginLeft: 'auto !important',
            gap: { xs: '4px', sm: '10px' },
            display: { xs: 'flex', lg: 'none' }
          }}
        >
          <IconButton aria-label="user-avatar" sx={{ padding: 0, marginLeft: 1 }}>
            {/* <AccountPopoverMobile /> */}
          </IconButton>

          {isDashboard && role?.toUpperCase() !== 'SUPERADMIN' && (
            <IconButton aria-label="Help" sx={{ padding: 0 }}>
              <HelpOutlineOutlinedIcon
                color="primary"
                onClick={() => setHelpDrawer(true)}
                sx={{ fontSize: { xs: '20px', sm: '24px' } }}
              />
            </IconButton>
          )}

          <IconButton aria-label="Notification" sx={{ padding: 0 }} onClick={() => setOpen(true)}>
            <NotificationsNoneOutlinedIcon
              color="primary"
              sx={{ fontSize: { xs: '20px', sm: '20px' } }}
            />
          </IconButton>
        </Box>
      </Stack>
      {showSearch && (
        <Card
          sx={{
            width: '100%',
            maxWidth: '100%',
            height: '100%',
            textAlign: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
            display: { xs: 'flex', md: 'none' },
            my: 1
          }}
        >
          <Search>
            <SearchIconWrapper>
              <SearchIcon
                style={{ fontSize: '20px', color: 'gray', marginTop: '1px' }}
                onClick={handleSubmit}
              />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search here..."
              data-testid="Search-holder"
              inputProps={{ 'aria-label': 'search' }}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleKeyPress}
              sx={{
                flex: 1,
                border: 'none',
                outline: 'none',
                paddingLeft: '10px',
                fontSize: '14px',
                marginLeft: '0'
              }}
            />
          </Search>
        </Card>
      )}

      <Drawer
        anchor={isSmallScreen ? 'bottom' : 'right'}
        open={open}
        onClose={toggleDrawer}
        sx={{
          ...(isSmallScreen
            ? {
                height: '60vh',
                maxHeight: '60vh'
              }
            : {
                height: '100vh',
                maxHeight: '100vh',
                width: '40%'
              }),
          '& .MuiDrawer-paper': {
            ...(isSmallScreen
              ? {
                  height: '60vh',
                  maxHeight: '60vh'
                }
              : {
                  height: '100vh',
                  maxHeight: '100vh',
                  width: '40%'
                })
          }
        }}
      >
        <Notification
          setDriverDetails={setDriverDetails}
          setAlertMetas={setAlertMetas}
          alertMetas={alertMetas}
          setIsDriverDetailModal={setIsDriverDetailModal}
        />
      </Drawer>
    </RootStyle>
  );
}
