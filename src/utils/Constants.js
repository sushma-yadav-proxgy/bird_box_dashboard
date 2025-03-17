export const IOT_VIDEO_CALL_STATUS = {
  VIDEO_CALL_EXPIRED: "expired",
  VIDEO_CALL_DIALING: "dialing",
  VIDEO_CALL_RINGING: "ringing",
  VIDEO_CALL_DECLINED: "declined",
  VIDEO_CALL_ACCEPTED: "accepted",
  VIDEO_CALL_DROPPED: "dropped",
  VIDEO_CALL_DISCONNECTED: "disconnected",
};

export const IOT_TOPICS = {
  VIDEO_CALL_IOT_TOPIC:
    "proxgy/{deviceType}/{orgId}/{zoneId}/d2s/{deviceId}/videocall",
  DEVICE_GET_SENSORS_TOT_TOPIC:
    "$aws/things/{deviceId}/shadow/name/sensors/get",
  DEVICE_ACCEPETED_SENSORS_TOT_TOPIC:
    "$aws/things/{deviceId}/shadow/name/sensors/get/accepted",
  DEVICE_UPDATED_SENSORS_TOT_TOPIC:
    "$aws/things/{deviceId}/shadow/name/sensors/update/documents",
  DEVICE_ORGANIZATION_SOS_TOPIC:
    "proxgy/{orgId}/s2c/{departmentId}/users/event/sos",
  DEVICE_ROLEID_SOS_TOPIC: "proxgy/{orgId}/s2c/departments/{roleId}/event/sos",
  DEVICE_USERID_SOS_TOPIC: "proxgy/{orgId}/s2c/departments/{userId}/event/sos",
};

export const ACTION_BUTTONS_ID = {
  CREATE_INCIDENT_BUTTON: "CREATE_INCIDENT_BUTTON",
  CREATE_DEPARTMENT_BUTTON: "CREATE_DEPARTMENT_BUTTON",
  CREATE_USER_BUTTON: "CREATE_USER_BUTTON",
  EXPORT_BUTTON: "EXPORT_BUTTON",
};

export const CALL_EVENT_TYPES = {
  VIDEO_CALL_RECORDING: "videoCallRecording",
  VIDEO_CALL_IMAGE: "videoCallImage",
  DEVICE_RECORDING: "deviceRecording",
  DEVICE_IMAGE: "deviceImage",
};

export const SCREEN_CONF = {
  DRAWER_WIDTH: 85,
  XL_DRAWER_WIDTH: 135,
  BAR_LAYOUT_L: 100,
  X_BAR_LAYOUT_L: 75,
};

export const USER_ROLE_TYPES = {
  SUPER_ADMIN_USER_ROLE: "superadmin",
};

export const COMMON_CONSTANTS = {
  PFOROM: "GT_PROHAT",
};

export const VIDEO_CALL_SETUP_STATE = {
  WAITING_FOR_REMOTE_STREAM: "WAITING_FOR_REMOTE_STREAM",
  REMOTE_TRACK_RECEIVED: "REMOTE_TRACK_RECEIVED",
  SETTING_UP_LOCAL: "SETTING_UP_LOCAL",
};
