import React, { useEffect, useRef, useState } from 'react';
import Page from '../components/common/Page';
import Header from '../components/common/Header';
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Grid2,
  Typography,
  Paper,
  FormControl,
  Select,
  MenuItem,
  Divider,
  Slider,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import { HeaderHeight, HeaderHeightMobile, PageHeaderHeight } from '../../constants/Constant';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import MapIcon from '@mui/icons-material/Map';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import MicOffIcon from '@mui/icons-material/MicOff';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SendCallRequest } from 'src/networks/Calls';
import TelescopingStick from '../components/common/TelescopingStick';
import MapView from '../components/dashboard/MapView';
import KinesisVideoStream from '../components/KinesisVideoStream';
import { encryptStorage } from 'src/CustomStorage';
import { APP_CONSTANTS } from 'src/URLConstants';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const useStyles = makeStyles((theme) => ({
  toolTip: {
    backgroundColor: 'gray',
    color: '#ffffff'
  },
  menuItem: {
    fontSize: '14px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px'
    },
    minHeight: '20px',
    borderRadius: '8px',
    marginInline: theme.spacing(1)
  },
  tableCellStyle: {
    fontSize: {
      xs: '12px',
      md: '14px'
    },
    fontWeight: 700,
    padding: {
      xs: '8px',
      md: '16px'
    },
    backgroundColor: '#FFFFFF'
  },
  tablePaper: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF'
  },
  tableContainer: {
    flexGrow: 1,
    height: `calc(100vh - ${HeaderHeight + PageHeaderHeight + 56 + 40 + 60 + 8}px)`,
    overflow: 'auto'
  }
}));

export default function Dashboard() {
  const classes = useStyles();
  const deviceId = 'birdboxtest1';

  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [videoAction, setVideoAction] = useState(false);
  const [videoCallStatus, setVideoCallStatus] = useState(false);
  const [videoCallId, setVideoCallId] = useState(null);
  const [alertMetas, setAlertMetas] = useState({
    snackBarOpened: false,
    vertical: 'top',
    horizontal: 'right',
    msg: '',
    variant: 'filled',
    severity: ''
  });

  const vertical = 'bottom';
  const horizontal = 'left';

  const handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertMetas({ ...alertMetas, snackBarOpened: false });
  };

  const handleVideoAction = async (action) => {
    try {
      setVideoAction(action);
      const res = await SendCallRequest(deviceId, action);
      if (res?.status === 'success') {
        setVideoCallStatus(action === true);
      } else {
        setVideoCallStatus(false);
      }
    } catch (err) {
      console.error('Error in handleVideoAction:', err);
      setVideoCallStatus(false);
    }
  };

  const cognitioCred = encryptStorage.getItem(APP_CONSTANTS.L_KEY_OF_USER_ADMIN_COGNIO_CRED);

  return (
    <Page title="BirdBox">
      <Header
        onOpenSidebar={() => setOpen(true)}
        helpdrawer={drawerOpen}
        setHelpDrawer={setDrawerOpen}
        name="Dashboard"
        showSearch={false}
      />
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
      <Container
        maxWidth="false"
        sx={{
          padding: '0 !important',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          height: {
            xs: `calc(100% - ${HeaderHeightMobile}px)`,
            md: `calc(100% - ${HeaderHeight}px)`
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'flex-end'
          }}
        >
          <FormControl>
            <Select
              sx={{
                fontSize: { xs: '12px', sm: '14px' },
                fontWeight: '500',
                minWidth: '130px',
                borderRadius: '12px',
                height: '40px',
                backgroundColor: '#ffffff'
              }}
              id="route_sort_filter"
              IconComponent={ExpandMoreIcon}
              value="BirdBox 1"
            >
              <MenuItem className={classes.menuItem} value="BirdBox 1">
                BirdBox 1
              </MenuItem>
              <MenuItem className={classes.menuItem} value="BirdBox 2">
                BirdBox 2
              </MenuItem>
              <MenuItem className={classes.menuItem} value="BirdBox 3">
                BirdBox 3
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Card
          sx={{
            backgroundColor: '#FFFFFF',
            padding: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          {/* Top Section */}
          <Grid container spacing={2} sx={{ maxHeight: '150px', minHeight: '150px' }}>
            <Grid item xs={2.5} sx={{ maxHeight: '150px', minHeight: '150px' }}>
              <Paper
                sx={{
                  padding: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  boxShadow: '0px 7.57px 14.38px 0.76px #EAEAFF',
                  backgroundColor: '#FFFFFF',
                  height: '100%'
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '22px',
                    color: '#171D40'
                  }}
                >
                  Main Area Camera
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: '10px',
                    lineHeight: '12px',
                    color: '#B0B9C7'
                  }}
                >
                  BBX_PRXGY_2345
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: '12px',
                    lineHeight: '16px',
                    color: '#171D40'
                  }}
                >
                  Nikhil Agarwal
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: '10px',
                    lineHeight: '10px',
                    color: '#B0B9C7'
                  }}
                >
                  ID: 1234567890
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    fontSize: '10px',
                    lineHeight: '12px',
                    color: '#B0B9C7',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <FiberManualRecordIcon
                    color="success"
                    sx={{ width: '10px', height: '10px', marginRight: '6px' }}
                  />{' '}
                  Online
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={1.5} sx={{ maxHeight: '150px', minHeight: '150px' }}>
              <Paper
                sx={{
                  padding: 2,
                  textAlign: 'center',
                  boxShadow: '0px 7.57px 14.38px 0.76px #EAEAFF',
                  backgroundColor: '#FFFFFF',
                  height: '100%'
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '12px',
                    lineHeight: '18px',
                    color: '#171D40'
                  }}
                >
                  Memory
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: '10px',
                    lineHeight: '12px',
                    color: '#171D40'
                  }}
                >
                  516gb used
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: '8px',
                    lineHeight: '10px',
                    color: '#B0B9C7'
                  }}
                >
                  3 hours left
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={1.5} sx={{ maxHeight: '150px', minHeight: '150px' }}>
              <Paper
                sx={{
                  padding: 2,
                  textAlign: 'center',
                  boxShadow: '0px 7.57px 14.38px 0.76px #EAEAFF',
                  backgroundColor: '#FFFFFF',
                  height: '100%'
                }}
              >
                <Typography variant="body2">Battery</Typography>
                <Typography variant="h6">80%</Typography>
                <Typography variant="caption">7 hours remaining</Typography>
              </Paper>
            </Grid>

            <Grid
              item
              xs={0.5}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                maxHeight: '150px',
                minHeight: '150px'
              }}
            >
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
                sx={{ height: '95%', borderColor: '#D9D9D9', width: '1px' }}
              />
            </Grid>

            <Grid item xs={6} sx={{ maxHeight: '150px', minHeight: '150px' }}>
              <Paper
                sx={{
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  boxShadow: '0px 7.57px 14.38px 0.76px #EAEAFF',
                  backgroundColor: '#FFFFFF',
                  height: '100%',
                  borderRadius: 1
                }}
              >
                <MapView />
              </Paper>
            </Grid>
          </Grid>

          {/* Camera Feed */}
          <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
            <Box
              sx={{
                position: 'absolute',
                top: 10,
                left: 10,
                background: 'white',
                padding: 1,
                borderRadius: 1,
                border: '1px solid #D9D9D9',
                zIndex: 9
              }}
            >
              <Typography variant="body2">24 January 2025</Typography>
              <Typography variant="body2">12:43 PM</Typography>
            </Box>

            <Box
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                padding: 1,
                borderRadius: 1,
                height: 'calc(100% - 20px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                zIndex: 9
              }}
            >
              <TelescopingStick
                alertMetas={alertMetas}
                setAlertMetas={setAlertMetas}
                deviceId={deviceId}
              />
            </Box>

            <Box
              sx={{
                width: '100%',
                height: '100%',
                backgroundColor: '#eee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {videoCallStatus ? (
                <KinesisVideoStream
                  streamChannel="birdboxtest1"
                  streamingStatus={videoCallStatus}
                />
              ) : (
                <Typography variant="h6" color="gray">
                  Camera Feed
                </Typography>
              )}
            </Box>
          </Card>

          {/* Controls */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 'auto'
            }}
          >
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" startIcon={<CameraAltIcon />}>
                Capture Photo
              </Button>
              <Button variant="outlined" startIcon={<MicOffIcon />}>
                Mute
              </Button>
            </Box>

            {!videoAction ? (
              <Button
                variant="contained"
                color="info"
                startIcon={<PowerSettingsNewIcon />}
                onClick={() => handleVideoAction(true)}
              >
                Video Start
              </Button>
            ) : (
              <Button
                variant="contained"
                color="error"
                startIcon={<PowerSettingsNewIcon />}
                onClick={() => handleVideoAction(false)}
              >
                Video Stop
              </Button>
            )}

            {/* <Button variant="outlined" color="primary" startIcon={<PowerSettingsNewIcon />}>
              Power Off
            </Button> */}
          </Box>
        </Card>
      </Container>
    </Page>
  );
}
