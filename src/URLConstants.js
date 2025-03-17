export const BIRD_BOX_API_ENDPOINTS = {
  LOGIN: "/api/v1/auth/admin/email/login",
  LOG_OUT: "/v1/auth/logout",
  COGNITO_SESSION_TOKEN: "/api/v1/cognito/authenticate",
  CALL_REQUEST: "/api/v1/payload/videoAction",
  TELESCOPE_MOVEMENT: "/api/v1/payload/controlTelescopicArm",
  GET_ALL_DEVICES: "/api/v1/devices",
};

export const IOT_NOTIFICATION_EVENTS = {
  FLAMMABLE_GAS_DETECTED_ALERT: "FLAMMABLE_GAS_DETECTED_ALERT",
  FLAMMABLE_GAS_SENSOR_ERROR: "FLAMMABLE_GAS_SENSOR_ERROR",
  DEVICE_FALL_ALERT: "DEVICE_FALL_ALERT",
  DEVICE_PROXIMITY_ALERT: "DEVICE_PROXIMITY_ALERT",
  DEVICE_SCANNER_DATA: "SCANNER_DATA",
  DEVICE_BATTERY_LOW_ALERT: "DEVICE_BATTERY_LOW_ALERT",
};

export const APP_CONSTANTS = {
  L_KEY_OF_USER_DATA: "puad",
  L_KEY_OF_USER_IOT_CLIENT_ID: "padiotc",
  L_KEY_OF_USER_LOGGEDIN_STATUS: "isLoggedin",
  L_KEY_OF_USER_ADMIN_SSOTOKEN: "sso-token",
  L_KEY_OF_USER_ADMIN_COGNIO_CRED: "cgntCred",
  G_MAP_API_KEY: "AIzaSyAnWB533E-FJrEgeCWUQ7amty8z_5ytuB4",
  AWS_COGNITO_DATA: "aws-cognito",
};

export const URL_CONSTANT = {
  LOGIN: "/login",
  FORGET_PASSWORD: "/forgot_password",
  CHANGE_PASSWORD: "/change_password/:otp",
  DASHBOARD: "/dashboard",
  BIRD_BOX: "/dashboard/birdbox",
  DEVICE: "/dashboard/device",
  NOT_FOUND: "/404",
};
