import { useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink as RouterLink, matchPath, useLocation } from 'react-router-dom';
import { useTheme, styled } from '@mui/material/styles';
import { Box, List, Collapse, ListItemText, ListItemIcon, ListItemButton } from '@mui/material';
import { useAuth } from '../../../customContextProvider/AuthProvider';

// ----------------------------------------------------------------------

const ListItemStyle = styled((props) => <ListItemButton disableGutters {...props} />)(
  ({ theme }) => ({
    ...theme.typography.body2,
    height: 48,
    position: 'relative',
    textTransform: 'capitalize',
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(2.5),
    color: theme.palette.text.secondary,
    '&:before': {
      top: '13.16%',
      right: '90%',
      width: '5px',
      bottom: '13.16%',
      content: "''",
      left: '0',
      display: 'none',
      position: 'absolute',
      borderTopRightRadius: 5,
      borderBottomRightRadius: 5,
      backgroundColor: theme.palette.primary.main
    }
  })
);

const ListItemIconStyle = styled(ListItemIcon)({
  width: 22,
  height: 22,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  marginLeft: '-25px',
  '&:before': {
    border: '1px solid #E3E3F0',
    borderRadius: '20px',
    background: '#F9F9FF',
    boxShadow: ' 0px 10px 19px 1px #EAEAFF'
  }
});

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
  active: PropTypes.func
};

function NavItem({ item, active }) {
  const theme = useTheme();
  const isActiveRoot = active(item.path);
  const { title, path, icon, info, children } = item;
  const [open, setOpen] = useState(isActiveRoot);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const activeRootStyle = {
    color: 'primary.main',
    fontWeight: 'fontWeightMedium',
    '&:before': {
      display: 'block'
    }
  };

  const activeIconStyle = {
    bgcolor: '#EAE8EF',
    borderRadius: '50%',
    width: '38px',
    height: '38px'
  };

  const activeSubStyle = {
    color: 'text.primary',
    fontWeight: 'fontWeightMedium',
    textAlign: 'left'
  };

  if (children) {
    return (
      <>
        <ListItemStyle
          onClick={handleOpen}
          sx={{
            ...(isActiveRoot && activeRootStyle)
          }}
        >
          <ListItemIconStyle
            sx={{
              width: '38px',
              height: '38px',
              ...(isActiveRoot && activeIconStyle)
            }}
          >
            {icon && icon}
          </ListItemIconStyle>
          <ListItemText disableTypography primary={title} />
          {info && info}
          {/* <Box
            component={Icon}
            icon={open ? arrowIosDownwardFill : arrowIosForwardFill}
            sx={{ width: 16, height: 16, ml: 1 }}
          /> */}
        </ListItemStyle>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children.map((item) => {
              const { title, path } = item;
              const isActiveSub = active(path);

              return (
                <ListItemStyle
                  key={title}
                  component={RouterLink}
                  to={path}
                  state={item?.state}
                  sx={{
                    ...(isActiveSub && activeSubStyle)
                  }}
                >
                  <ListItemIconStyle>
                    <Box
                      component="span"
                      sx={{
                        width: 4,
                        height: 4,
                        display: 'flex',
                        borderRadius: '50%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'text.disabled',
                        transition: (theme) => theme.transitions.create('transform'),
                        ...(isActiveSub && {
                          transform: 'scale(2)',
                          bgcolor: 'primary.main'
                        })
                      }}
                    />
                  </ListItemIconStyle>
                  <ListItemText disableTypography primary={title} />
                  {info && info}
                </ListItemStyle>
              );
            })}
          </List>
        </Collapse>
      </>
    );
  }

  return (
    <ListItemStyle
      component={RouterLink}
      to={path}
      sx={{
        mb: 1,
        textAlign: 'left',

        ...(isActiveRoot && activeRootStyle)
      }}
    >
      <ListItemIconStyle
        sx={{
          width: '38px',
          height: '38px',
          ...(isActiveRoot && activeIconStyle)
        }}
      >
        {' '}
        {icon && icon}{' '}
      </ListItemIconStyle>
      <ListItemText disableTypography primary={title} />
      {info && info}
    </ListItemStyle>
  );
}

NavSection.propTypes = {
  navConfig: PropTypes.array
};

export default function NavSection({ navConfig, ...other }) {
  const { pathname } = useLocation();
  const { sessionUserData } = useAuth();

  const userRole = sessionUserData?.user?.userRole?.roleName;

  const match = (path) => (path ? !!matchPath({ path, end: false }, pathname) : false);

  return (
    <Box {...other}>
      <List disablePadding>
        {navConfig?.map((item) => {
          // Determine whether the item should be shown based on role
          const isVisible = true;
          //   const isVisible = item?.role?.includes("superadmin")
          //     ? userRole === "superadmin"
          //     : true;

          return isVisible ? <NavItem key={item.title} item={item} active={match} /> : null;
        })}
      </List>
    </Box>
  );
}
