/* eslint-disable */

import axios from 'axios';
import { APP_CONSTANTS } from '../URLConstants';
import { encryptStorage } from '../CustomStorage';

const BirdBoxApiCallerInstance = axios.create({
  baseURL: process.env.REACT_APP_BIRD_BOX_HOST
});

BirdBoxApiCallerInstance.interceptors.request.use(
  (request) => {
    request.headers['Authorization'] = `Bearer ${encryptStorage.getItem(
      APP_CONSTANTS.L_KEY_OF_USER_ADMIN_SSOTOKEN
    )}`;
    return request;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

BirdBoxApiCallerInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error);
    if (error?.response?.status === 401) {
      encryptStorage.setItem(APP_CONSTANTS.L_KEY_OF_USER_LOGGEDIN_STATUS, false);
      encryptStorage.setItem(APP_CONSTANTS.L_KEY_OF_USER_ADMIN_SSOTOKEN, null);
      encryptStorage.setItem(APP_CONSTANTS.L_KEY_OF_USER_DATA, null);
      encryptStorage.setItem(APP_CONSTANTS.AWS_COGNITO_DATA, null);
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

export default BirdBoxApiCallerInstance;
