import React, { useState } from 'react';
import Page from '../components/common/Page';
import Header from '../components/common/Header';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import {
  Alert,
  Box,
  Card,
  CircularProgress,
  Container,
  Pagination,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import NoDataAvailable from '../components/common/NoDataAvailable';
import { HeaderHeight, PageHeaderHeight } from 'src/constants/Constant';

const useStyles = makeStyles((theme) => ({
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
    textWrap: 'nowrap',
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
    height: `calc(100vh - ${HeaderHeight + PageHeaderHeight + 56 + 40}px)`,
    overflow: 'auto'
  }
}));
export default function Media() {
  const classes = useStyles();
  const [allBirdBoxDevices, setAllBirdBoxDevices] = useState([]);
  const [loader, setLoader] = useState(false);
  const [page, setPage] = useState(0);
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

  const handlePageChange = (event, value) => {
    setPage(value);
  };
  return (
    <Page title="Device">
      <Header
        onOpenSidebar={() => setOpen(true)}
        // handleSearch={handleDeviceSearch}
        // handleSubmit={SearchDevices}
        name="Media"
        showSearch={true}
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
      <Container maxWidth="false" disableGutters sx={{ padding: 0 }}>
        {/* <PageHeader>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="medium"
              sx={{
                backgroundColor: '#FFFFFF',
                boxShadow: '0px 10px 19px 1px #EAEAFF'
              }}
            >
              Add Device
            </Button>
          </Box>
        </PageHeader> */}

        <Box sx={{ width: '100%', typography: 'body1' }}>
          <Card sx={{ width: '100%' }}>
            <Paper className={classes.tablePaper}>
              <TableContainer className={classes.tableContainer}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableCellStyle} width={150}>
                        Device ID
                      </TableCell>
                      <TableCell align="left" className={classes.tableCellStyle} width={300}>
                        Device Health
                      </TableCell>
                      <TableCell align="left" className={classes.tableCellStyle} width={200}>
                        Device User
                      </TableCell>
                      <TableCell align="left" className={classes.tableCellStyle} width={100}>
                        Device Status
                      </TableCell>
                      <TableCell align="left" className={classes.tableCellStyle} width={100}>
                        Device location
                      </TableCell>
                      <TableCell align="left" className={classes.tableCellStyle} width={100}>
                        Service
                      </TableCell>

                      <TableCell align="left" className={classes.tableCellStyle}></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {allBirdBoxDevices?.data?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={10}>
                          <NoDataAvailable />
                        </TableCell>
                      </TableRow>
                    )}
                    {loader ? (
                      <TableRow>
                        <TableCell colSpan={10}>
                          <LoaderContainer>
                            <CircularProgress size={30} />
                          </LoaderContainer>
                        </TableCell>
                      </TableRow>
                    ) : (
                      allBirdBoxDevices?.data?.map((row) => (
                        <TableRow
                          key={row?.id}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 }
                          }}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            align="left"
                            sx={{
                              minWidth: '5vw',
                              textWrap: 'nowrap',
                              textTransform: 'capitalize',
                              padding: {
                                xs: '8px',
                                md: '16px'
                              },
                              fontSize: {
                                xs: '12px',
                                md: '14px'
                              }
                            }}
                          >
                            <Typography>{row.name}</Typography>
                            <Typography>{row.id}</Typography>
                          </TableCell>

                          <TableCell
                            component="th"
                            scope="row"
                            align="left"
                            sx={{
                              minWidth: '5vw',
                              textWrap: 'nowrap',
                              textTransform: 'capitalize',
                              padding: {
                                xs: '8px',
                                md: '16px'
                              },
                              fontSize: {
                                xs: '12px',
                                md: '14px'
                              }
                            }}
                          >
                            <Typography>{row?.latestEvent?.battery_remaining}% remaning</Typography>
                            <Typography>85% remaning</Typography>
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={{
                              minWidth: '5vw',
                              textWrap: 'nowrap',
                              textTransform: 'capitalize',
                              padding: {
                                xs: '8px',
                                md: '16px'
                              },
                              fontSize: {
                                xs: '12px',
                                md: '14px' // Larger screens
                              }
                            }}
                          >
                            <Typography>{row.organization_name}</Typography>
                            <Typography>{row.organization_id}</Typography>
                            <Typography>23-01-2024 at 04:43PM</Typography>
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            align="left"
                            sx={{
                              minWidth: '5vw',
                              textWrap: 'nowrap',
                              textTransform: 'capitalize',
                              padding: {
                                xs: '8px',
                                md: '16px'
                              },
                              fontSize: {
                                xs: '12px',
                                md: '14px'
                              }
                            }}
                          >
                            <Typography>Undeployed</Typography>
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            align="left"
                            sx={{
                              minWidth: '5vw',
                              textWrap: 'nowrap',
                              textTransform: 'capitalize',
                              cursor: 'pointer',
                              padding: {
                                xs: '8px',
                                md: '16px'
                              },
                              fontSize: {
                                xs: '12px',
                                md: '14px'
                              }
                            }}
                          >
                            <Typography>New Delhi</Typography>
                            <Typography>
                              {(row?.latestEvent?.lat, row?.latestEvent?.lng)}
                            </Typography>
                          </TableCell>

                          <TableCell
                            component="th"
                            scope="row"
                            align="left"
                            sx={{
                              minWidth: '5vw',
                              textWrap: 'nowrap',
                              textTransform: 'capitalize',
                              padding: {
                                xs: '8px',
                                md: '16px'
                              },
                              fontSize: {
                                xs: '12px',
                                md: '14px'
                              }
                            }}
                          >
                            <Typography>Last serviced on</Typography>
                            <Typography>23 December 2025</Typography>
                          </TableCell>

                          <TableCell
                            align="right"
                            sx={{
                              padding: {
                                xs: '8px',
                                md: '16px'
                              }
                            }}
                          >
                            <MoreVertIcon />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {allBirdBoxDevices?.data?.length !== 0 && (
                <Stack
                  sx={{
                    marginTop: '10px',
                    marginBottom: '10px'
                  }}
                >
                  <Pagination
                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                    count={allBirdBoxDevices?.totalPages}
                    showFirstButton
                    showLastButton
                    onChange={handlePageChange}
                    page={page}
                    total={allBirdBoxDevices?.total}
                    sx={{
                      '& .MuiPaginationItem-root': {
                        padding: '8px',
                        minWidth: {
                          xs: '24px',
                          md: '32px'
                        },
                        height: {
                          xs: '24px',
                          md: '32px'
                        },
                        fontSize: {
                          xs: '12px',
                          md: '14px'
                        }
                      }
                    }}
                  />
                </Stack>
              )}
            </Paper>
          </Card>
        </Box>
      </Container>
    </Page>
  );
}
