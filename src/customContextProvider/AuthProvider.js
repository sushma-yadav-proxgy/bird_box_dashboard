import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APP_CONSTANTS } from "../URLConstants";
import { encryptStorage } from "../CustomStorage";
import AWS from "aws-sdk";
import axios from "axios";
import AWSIoTData from "aws-iot-device-sdk";

const loadScript = (src, onLoad) => {
  const script = document.createElement("script");
  script.src = src;
  script.onload = onLoad;
  script.onerror = () => console.error(`Failed to load script: ${src}`);
  document.body.appendChild(script);
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [sessionUserData, setSessionUserData] = useState(
    encryptStorage.getItem(APP_CONSTANTS.L_KEY_OF_USER_DATA)
  );

  const region = "ap-south-1";
  const AWS_IOT_ENDPOINT_HOST =
    "a3323ojfyuiyrv-ats.iot.ap-south-1.amazonaws.com";
  let mqtt = null;
  const awsConfig = {
    mqttEndpoint: AWS_IOT_ENDPOINT_HOST,
    region: region,
  };

  const [rtcClientCallbackFunctions, setRtcClientCallbackFunctions] = useState({
    onLoginSuccessData: null,
    onKickOutData: null,
    onLoginFailedData: null,
    onCallReceived: null,
    onUserStatusEvent: null,
    onUserListEvent: null,
    onCallAnswered: null,
    onCallHangup: null,
    onSOSEvent: null,
    onGPSEvent: null,
    onVideoMonitorEvent: null,
  });

  const [mqttClientContext, setMqttCientContext] = useState(null);
  const [mqttClientCallFunctions, setMqttClientCallBackFunctions] = useState({
    ON_MESSAGE: null,
    ON_DISCONNECT: null,
    ON_CONNECT: null,
  });

  const [rtcClient, setRtcClient] = useState(null);
  const [loginInfo, setLoginInfo] = useState({
    account: "111257",
    password: "13579",
    server: "video.pttlink.com",
    port: 9443,
    httpPort: 443,
    nodomain: false,
    version: "v2",
    language: "en",
  });

  useEffect(() => {
    loadScript("/hrtc.js", () => {
      if (typeof SIP === "undefined") {
        console.error("SIP library is not available.");
      }
    });
  }, []);

  const authenticateSession = (adminData) => {
    encryptStorage.setItem(APP_CONSTANTS.L_KEY_OF_USER_LOGGEDIN_STATUS, true);
    encryptStorage.setItem(
      APP_CONSTANTS.L_KEY_OF_USER_ADMIN_SSOTOKEN,
      adminData?.token
    );
    encryptStorage.setItem(APP_CONSTANTS.L_KEY_OF_USER_DATA, adminData);
    encryptStorage.setItem(
      APP_CONSTANTS.L_KEY_OF_USER_IOT_CLIENT_ID,
      adminData?.iot?.clientId
    );
    setSessionUserData(adminData);
    loginToPHelmet();
  };

  const logoutSession = () => {
    encryptStorage.setItem(APP_CONSTANTS.L_KEY_OF_USER_LOGGEDIN_STATUS, false);
    encryptStorage.setItem(APP_CONSTANTS.L_KEY_OF_USER_ADMIN_SSOTOKEN, null);
    encryptStorage.setItem(APP_CONSTANTS.L_KEY_OF_USER_DATA, null);
    encryptStorage.setItem(APP_CONSTANTS.L_KEY_OF_USER_IOT_CLIENT_ID, null);
    setSessionUserData(null);
    setMqttClientCallBackFunctions((prevState) => ({
      ...prevState,
      ON_MESSAGE: null,
    }));
    navigate("/login", { replace: true });
  };

  function connectToIOT(userData, callback) {
    const params = {
      IdentityId: userData?.cognito?.IdentityId,
      Logins: {
        "cognito-identity.amazonaws.com":
          userData?.cognito?.Logins["cognito-identity.amazonaws.com"],
      },
    };

    const cognitoidentity = new AWS.CognitoIdentity({ region });
    cognitoidentity.getCredentialsForIdentity(params, (err, data) => {
      if (err) {
        console.error("Error getting credentials for identity:", err);
        callback(false);
      } else {
        console.log("cognito_login_at_context", data);

        AWS.config.credentials = new AWS.Credentials(
          data?.Credentials?.AccessKeyId,
          data?.Credentials?.SecretKey,
          data?.Credentials?.SessionToken
        ); // See AWS Setup and Security below
        //  AWS.config.credentials = new AWS.Credentials("ASIA5O2VG7NJS4KTV7YP", "GUZIx9a9NQVCeX+JMZ/s/MLamMSo9GrdYO0v78R", "IQoJb3JpZ2luX2VjEG8aCmFwLXNvdXRoLTEiRjBEAiB5zg0eBqrYg2eoA/GbPs5t1QrF/2UVZMFuljMTrKEcAAIgSdq/K/3RReql3pdktUjLLoNxbC3Vt/IJtbMalw6H6PEq0wQI6P//////////ARADGgw5MjUyMDcyOTY4NTEiDFQOSGVhHcPOD1GGlSqnBPhxhWzZ+MswlTJh1W/CIWxL1Dy+Z6efuIqH4hqdm98KyjIMqwKtClUcGWJz6s5/xnEb1RZ5C6Ojoat0wc/SzujEqOynydhU+AILGGXk/O0pIuDdDF+ps2xXfBSHI8O2dMlJtRl1MQqQol0d61D7N4Yh+PTpIQXWBmT0NdnM0cdbGSMV2J2WY9rsxyoGCE36fAorm+wun0mrGrZ4+nERrz7Fj4cXQAw09UbLQu10brCBJ83kRN0qKsj+NriRsI9Pw+M1ZcD9OrncoHcEtpgAktQlITfLFgCrE8BpHGMMkjac4nWzZJpuIWa3vYnpH2niF8oewjhm/VaN/4RreUYnqOuzqlDNtjOYHgh+ro5fPEAlc7FXZXgpmEMjm/fDdefo5tnxMwXdQ41EYHn8HIQYYEGJo/tt4j+RgX5eBOiEYjxX0QH4ISSZWzXjaqwYdcj1eVrPj1fwlnhVJJxbBsfuYHX3TcpoHQetr5igeOpiWEWDlnb65PPlHunz6Ys0Ta4dP+XgSlHT3KvyQAdC1PoFCHboM8KF+Tk9MdCKpNQ6u68UHJn67PUwiy8Cnq4rXJ09sasmWQb3dt3Ym/VdfgyFxKt890ecPjikzKFoiU6j2262h3xLDDxwQAtYuY4JJhDUW8lP8VRdQXXxgA/fygNjr+7RJeQ/e0G9ks0/Qx7OTMn/tS3dGdQK3pqlXwR4PZY45wsVV20Dh99vVOy+f884OdxE8ouKwwHmMNrUobkGOoYCFlb8lZSpcaAF+De83R1vpOwj7pf9pNbfOTjMRJ/LUZjEe5dRxUH24QHpVvzNKb438SpAnjZ3r1YOnPwom1q7aVk44BkWq0kOzQ52/onDXd05NcwEuDIUge1YwyZgKGhTaTDlMDiPRgxTepihsYtd9CHpwIF/H1k9s5bgC/lWaJEw/WONFmbXri+rlXj6sxIskY+qUF+2VcrDyQtuCEG9jfdTkaxMEcIfrX4jhcWhILv6CJ+y0v3SONUgqIbgV9oUmRFslBvLZXWfLmdzoJYse2fiZl5lVwSNd+u7Vy0mTMPiSbOcSN3gatvFaBzjA3eWFzFNy1wKtnczY5gJOb5sit6rQxvURA==");// See AWS Setup and Security below

        encryptStorage.setItem(
          APP_CONSTANTS.L_KEY_OF_USER_ADMIN_COGNIO_CRED,
          data
        );
        mqtt = AWSIoTData.device({
          region: awsConfig.region,
          host: awsConfig.mqttEndpoint,
          clientId: userData?.iot?.clientId,
          protocol: "wss",
          maximumReconnectTimeMs: 30000,
          autoResubscribe: false,
          offlineQueueDropBehavior: "newest",
          clean: true,
          debug: false,
          accessKeyId: data?.Credentials?.AccessKeyId,
          secretKey: data?.Credentials?.SecretKey,
          sessionToken: data?.Credentials?.SessionToken,
        });
        AWS.config.credentials.get((err) => {
          if (err) {
            console.log(AWS.config.credentials);
            throw err;
          } else {
            mqtt.updateWebSocketCredentials(
              AWS.config.credentials.accessKeyId,
              AWS.config.credentials.secretAccessKey,
              AWS.config.credentials.sessionToken
            );
          }
        });
        mqtt.on("connect", () => {
          setMqttCientContext((mqttClientContext) => mqtt);
          callback(true);
          setTimeout(() => {
            if (sessionUserData) {
              subscribeUsingLocalContext(
                IOT_TOPICS?.DEVICE_ROLEID_SOS_TOPIC?.replace(
                  "{orgId}",
                  sessionUserData?.user?.organizationId
                )?.replace("{roleId}", sessionUserData?.user?.roleId)
              );

              if (
                sessionUserData?.user?.departmentId != null &&
                sessionUserData?.user?.departmentId !== undefined
              )
                subscribeUsingLocalContext(
                  IOT_TOPICS?.DEVICE_ORGANIZATION_SOS_TOPIC?.replace(
                    "{orgId}",
                    sessionUserData?.user?.organizationId
                  )?.replace(
                    "{departmentId}",
                    sessionUserData?.user?.departmentId
                  )
                );

              subscribeUsingLocalContext(
                IOT_TOPICS?.DEVICE_USERID_SOS_TOPIC?.replace(
                  "{orgId}",
                  sessionUserData?.user?.organizationId
                )?.replace("{userId}", sessionUserData?.user?.id)
              );
            }
          }, 500);
        });
        mqtt.on("message", (topic, payload) => {
          if (payload instanceof Uint8Array && payload?.byteLength === 0) {
            console.log("Payload is an empty Uint8Array");
            return;
          }
          const convertedMsgPayload = UnitArrayTOJSON(payload);
          if (convertedMsgPayload) {
            setMqttClientCallBackFunctions((prevState) => ({
              ...prevState,
              ON_MESSAGE: { topic: topic, payload: convertedMsgPayload },
            }));
          } else {
            console.error("Failed to decode or parse the payload.");
          }
        });
        mqtt.on("error", (err) => {
          console.log("mqttClient error:", userData?.iot?.clientId);
        });

        mqtt.on("close", (err) => {
          console.log("mqttClient close:", userData?.iot?.clientId);
        });

        mqtt.on("offline", (err) => {
          console.log("MQTT offline", userData?.iot?.clientId);
        });

        mqtt.on("reconnect", (err) => {
          console.log("MQTT reconnecting", userData?.iot?.clientId);
        });
      }
    });
  }

  function subscribeToTopic(topic) {
    if (mqttClientContext !== null) {
      mqttClientContext?.subscribe(topic, (err) => {
        if (!err) {
          console.log("iot_subscribing", "subscribe".concat(topic));
        } else {
          console.log(`iot_error, ${topic}  ===  ${err}`);
        }
      });
    }
  }

  function subscribeUsingLocalContext(topic) {
    if (mqtt !== null) {
      mqtt?.subscribe(topic, (err) => {
        if (!err) {
          console.log("iot_subscribing", "subscribe".concat(topic));
        } else {
          console.log(`iot_error, ${topic}  ===  ${err}`);
        }
      });
    }
  }

  function unSubscribeToTopic(topic) {
    mqttClientContext?.unsubscribe(topic, (err) => {
      if (!err) {
        console.log("iot_unsubscribing", "unsubscribe_err".concat(topic));
      } else {
        console.log("unsub_iot_uerror", "unsubscribed".concat(topic));
      }
    });
  }

  const loginToPHelmet = () => {
    // Ensure SIP is available
    if (window?.SIP !== null && window?.SIP !== undefined) {
      const client = new window.SIP.Web.RtcClient(
        loginInfo?.server,
        loginInfo?.port,
        loginInfo?.account,
        loginInfo?.password,
        rtcClientCallback,
        !loginInfo?.nodomain,
        loginInfo?.httpPort,
        loginInfo?.version,
        loginInfo?.language
      );
      setRtcClient(client);

      let httpUrl = loginInfo.nodomain ? "http://" : "https://";
      httpUrl += `${loginInfo.server}:${loginInfo.httpPort}`;
      axios.defaults.baseURL = httpUrl; // Configure the API base URL
      client.login(); // Call the login method on the RTC client
    }
  };

  // Function to handle logout
  const logoutFromPHelmet = () => {
    if (rtcClient) {
      rtcClient.logout().then(() => {
        console.log("after logout");
      });
    }
  };

  const rtcClientCallback = {
    onLoginSuccess: async (message) => {
      console.log("Login successful");
      setRtcClientCallbackFunctions((prev) => ({
        ...prev,
        onLoginSuccessData: message,
      }));
    },
    onLoginFailed: (mes) => {
      console.log("onLoginFailed", new Date());

      setRtcClientCallbackFunctions((prev) => ({
        ...prev,
        onLoginFailed: mes,
      }));
    },
    onKickOut: (from, mes) => {
      console.log("Others log in to their account", from);
    },
    onLogout: () => {},
    onUserListEvent: (from, result) => {
      // console.log('onUserListEvent from ', from, ' result: ', result);
      // setUserList(result);

      setRtcClientCallbackFunctions((prev) => ({
        ...prev,
        onUserListEvent: { from, result },
      }));
    },
    onUserStatusEvent: (from, result) => {
      // setUserStatusList(result);

      setRtcClientCallbackFunctions((prev) => ({
        ...prev,
        onUserStatusEvent: { from, result },
      }));
    },
    onLiveCallsEvent: (from, result) => {
      // setUserLiveCalls(result);
      // setVoiceSchedulingInfo((prevInfo) => ({
      //   ...prevInfo,
      //   channelInfo: result,
      // }));
    },
    onGroupEvent: (result) => {
      // setUserGroupList(result);
    },
    onCallAnswered: (id, callee) => {
      console.log("onCallAnswered, id ", id, " callee ", callee);
      // if (id === voiceMonitoringInfo.callId) {
      //   setMuteLocalMic();
      // }
      // if (id === videoMonitorInfo.callId) {
      //   stopLocalStream(videoMonitorInfo.number);
      // }

      setRtcClientCallbackFunctions((prev) => ({
        ...prev,
        onCallAnswered: { id, callee },
      }));
    },
    onCallReceived: (id, callee, isVideo, callType, initiator, members) => {
      console.log(
        "onCallReceived, id ",
        id,
        " caller ",
        callee,
        " is video ",
        isVideo,
        " callType ",
        callType,
        " initiator ",
        initiator,
        " members ",
        members
      );

      setRtcClientCallbackFunctions((prev) => ({
        ...prev,
        onCallReceived: { id, callee, isVideo, callType, initiator, members },
      }));
    },
    onCallHangup: (id, callee) => {
      console.log("call end ", id, " caller ", callee);

      setRtcClientCallbackFunctions((prev) => ({
        ...prev,
        onCallHangup: { callId: id, calleeId: callee },
      }));
    },
    onPttEvent: (id, from, state, stateNumber, members, count) => {
      console.log(
        "onPttEvent from ",
        from,
        " state ",
        state,
        " stateNumber:",
        stateNumber,
        " members:",
        members,
        " count:",
        count
      );
    },
    onMessageEvent: (from, type, msg) => {
      console.log("message event from:", from, " type:", type);
    },
    onGPSEvent: (from, msg) => {
      console.log("gps event from:", from);

      setRtcClientCallbackFunctions((prev) => ({
        ...prev,
        onGPSEvent: { from, msg },
      }));
    },
    onSOSEvent: (from, msg) => {
      console.log("sos event from:", from);
      // setSOSInfo(msg);
      setRtcClientCallbackFunctions((prev) => ({
        ...prev,
        onSOSEvent: { from, msg },
      }));
    },
    onVideoMonitorEvent: (caller, callee, result) => {
      console.log("Video Monitor Event:", caller, callee, result);

      const d = JSON.parse(result);
      setRtcClientCallbackFunctions((prev) => ({
        ...prev,
        onVideoMonitorEvent: {
          caller: caller,
          callee: callee,
          result: d,
          playUrl: d?.flv,
        },
      }));
    },
  };

  return (
    <AuthContext.Provider
      value={{
        sessionUserData,
        loginInfo,
        rtcClient,
        rtcClientCallback,
        rtcClientCallbackFunctions,
        mqttClientContext,
        mqttClientCallFunctions,
        setMqttCientContext,
        subscribeToTopic,
        authenticateSession,
        logoutSession,
        connectToIOT,
        loginToPHelmet,
        logoutFromPHelmet,
        // viewer,
        // isStreaming,
        // setIsStreaming,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
