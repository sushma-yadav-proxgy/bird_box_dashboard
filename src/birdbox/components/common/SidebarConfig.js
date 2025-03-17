import React from 'react';
import { ReactComponent as HomeIcon } from '../../../icons/home.svg';
import { ReactComponent as DeviceIcon } from '../../../icons/devices.svg';
import { ReactComponent as MediaIcon } from '../../../icons/media.svg';
import { URL_CONSTANT } from '../../../URLConstants';

const sidebarConfig = [
  {
    title: 'Home',
    path: '/dashboard/birdbox',
    icon: <HomeIcon />,
    env: ['development', 'sandbox', 'production'],
    role: ['superadmin', 'admin']
  },
  {
    title: 'Devices',
    path: '/dashboard/device',
    icon: <DeviceIcon />,
    env: ['development', 'sandbox', 'production'],
    role: ['superadmin', 'admin']
  },
  {
    title: 'Media',
    path: '/dashboard/media',
    icon: <MediaIcon />,
    env: ['development', 'sandbox', 'production'],
    role: ['superadmin', 'admin']
  }
];

export default sidebarConfig;
