import { Box, Card, CircularProgress, Stack, Tab, Tabs, Typography } from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import CachedIcon from '@mui/icons-material/Cached';

const useStyles = makeStyles({
  locationHistoryTitle: {
    fontSize: 14,
    fontWeight: 'bold'
  },

  locationHistoryAddress: {
    fontSize: 12
  },

  cardWithBorder: {
    background: '#FFFFFF',
    boxShadow: '0px 10px 19px 1px #EAEAFF',
    boxSizing: 'border-box',
    borderRadius: '20px',
    flexGrow: 1,
    overflow: 'auto',
    marginTop: 'auto',
    height: 'calc(100% - 60px)'
  }
});

export default function Notification({
  setDriverDetails,
  setAlertMetas,
  alertMetas,
  setIsDriverDetailModal
}) {
  const navigate = useNavigate();
  const classes = useStyles();

  const [loading, setLoading] = useState(false);

  const [expanded, setExpanded] = useState(false);
  const [selectedTab, setSelectedTab] = useState('1');
  const [severeAlertsData, setSevereAlertsData] = useState([]);
  const [resolvedEvent, setResolvedEvent] = useState(null);
  const [resolveEventError, setResolveEventError] = useState(false);
  const [moderateAlertsData, setModerateAlertsData] = useState([1, 2, 3]);
  const [tempSevereAlertData, setTempSevereAlertData] = useState([1, 2, 3]);
  const [openResolvedModal, setOpenResolvedModal] = useState(false);
  const [selectedAlertData, setSelectedAlertData] = useState(null);

  const handleSelectedTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleExpandChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const getAllNotification = async () => {
    // try {
    //   setLoading(true);
    //   const res = await GetDashboardStatsData();
    //   setLoading(false);
    //   setSevereAlertsData(res?.data?.data?.notificationDetails || []);
    // } catch (err) {
    //   setLoading(false);
    //   console.error("Error fetching notification data:", err);
    // }
  };

  const handleNotificationResolved = () => {
    if (resolvedEvent === null) {
      setResolveEventError(true);
      setAlertMetas({
        ...alertMetas,
        severity: 'error',
        snackBarOpened: true,
        msg: 'Please select notification to resolve'
      });
      setTimeout(() => setAlertMetas({ ...alertMetas, snackBarOpened: false, msg: '' }), 60000);
    } else {
      setResolveEventError(false);
      setSelectedAlertData(resolvedEvent);
      setOpenResolvedModal(true);
    }
  };

  const handleRefresh = () => {
    getAllNotification();
  };

  useEffect(() => {
    getAllNotification();
  }, []);

  return (
    <Card id="notification_alerts_card" className={classes.cardWithBorder} sx={{ height: '100%' }}>
      <Box sx={{ mt: 2, overflowX: 'hidden' }}>
        <Stack
          direction="row"
          sx={{ p: 2 }}
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '18px',
              lineHeight: '23px',
              color: '#171D40'
            }}
          >
            Notifications
          </Typography>
          {loading ? (
            <CircularProgress sx={{ color: '#000000' }} size={22} />
          ) : (
            <CachedIcon onClick={handleRefresh} sx={{ color: '#000000', cursor: 'pointer' }} />
          )}
        </Stack>

        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={selectedTab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={selectedTab}
                onChange={handleSelectedTabChange}
                variant="fullWidth"
                aria-label="full width tabs example"
              >
                <Tab wrapped label="Most recent" value="1" />
                <Tab wrapped label="Yesterday" value="2" />
                <Tab wrapped label="Day Before" value="3" />
              </Tabs>
            </Box>

            <TabPanel sx={{ p: 0, pt: 2 }} value="1">
              Item 1
            </TabPanel>

            <TabPanel sx={{ p: 0, pt: 2 }} value="2">
              Item 2
            </TabPanel>

            <TabPanel sx={{ p: 0, pt: 2 }} value="3">
              Item 3
            </TabPanel>
          </TabContext>
        </Box>
      </Box>
    </Card>
  );
}
