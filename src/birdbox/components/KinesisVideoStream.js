import React, { useEffect, useRef } from "react";
import { store, view } from "@risingstack/react-easy-state";
import KinesisVideo from "aws-sdk/clients/kinesisvideo";
import KinesisVideoSignalingChannels from "aws-sdk/clients/kinesisvideosignalingchannels";
import { SignalingClient } from "amazon-kinesis-video-streams-webrtc";
import { Box } from "@mui/material";
import { encryptStorage } from "src/CustomStorage";
import { APP_CONSTANTS } from "src/URLConstants";

//------------------------------------------------------------------------------
const KinesisWebRTC = view(({ streamChannel, streamingStatus }) => {
  const cognitioCred = encryptStorage.getItem(
    APP_CONSTANTS.L_KEY_OF_USER_ADMIN_COGNIO_CRED
  );

  const state = store({
    accessKey: cognitioCred?.Credentials?.AccessKeyId,
    secretAccessKey: cognitioCred?.Credentials?.SecretKey,
    sessionToken: cognitioCred?.Credentials?.SessionToken,
    region: "ap-south-1",
    role: "VIEWER",
    channelName: streamChannel,
    clientId: getRandomClientId(),
    endpoint: null,
    openDataChannel: true,
    resolution: "widescreen",
    natTraversal: "stunTurn",
    useTrickleICE: true,
    messageToSend: "",
    playerIsStarted: false,
  });

  state.remoteView = useRef(null);

  useEffect(() => {
    for (const [key] of Object.entries(state)) {
      let localStorageValue = localStorage.getItem(`kvs-widget-${key}`);
      if (localStorageValue) {
        if (["true", "false"].includes(localStorageValue)) {
          localStorageValue = localStorageValue === "true";
        }
        state[key] = localStorageValue;
      }
    }
  }, []);

  useEffect(() => {
    if (streamingStatus) {
      state.playerIsStarted = true;
      startPlayerForViewer();
    } else {
      state.playerIsStarted = false;
      stopPlayerForViewer();
    }
  }, [streamingStatus]);

  async function startPlayerForViewer() {
    console.log("Created KVS client...");
    const kinesisVideoClient = new KinesisVideo({
      region: state.region,
      endpoint: state.endpoint || null,
      correctClockSkew: true,
      accessKeyId: state.accessKey,
      secretAccessKey: state.secretAccessKey,
      sessionToken: state.sessionToken || null,
    });

    console.log("Getting signaling channel ARN...");
    const describeSignalingChannelResponse = await kinesisVideoClient
      .describeSignalingChannel({
        ChannelName: state.channelName,
      })
      .promise();

    const channelARN = describeSignalingChannelResponse.ChannelInfo.ChannelARN;
    console.log("[VIEWER] Channel ARN: ", channelARN);

    console.log("Getting signaling channel endpoints...");
    const getSignalingChannelEndpointResponse = await kinesisVideoClient
      .getSignalingChannelEndpoint({
        ChannelARN: channelARN,
        SingleMasterChannelEndpointConfiguration: {
          Protocols: ["WSS", "HTTPS"],
          Role: state.role,
        },
      })
      .promise();

    const endpointsByProtocol =
      getSignalingChannelEndpointResponse.ResourceEndpointList.reduce(
        (endpoints, endpoint) => {
          endpoints[endpoint.Protocol] = endpoint.ResourceEndpoint;
          return endpoints;
        },
        {}
      );
    console.log("[VIEWER] Endpoints: ", endpointsByProtocol);

    console.log(`Creating signaling client...`);
    state.signalingClient = new SignalingClient({
      channelARN,
      channelEndpoint: endpointsByProtocol.WSS,
      role: state.role,
      region: state.region,
      systemClockOffset: kinesisVideoClient.config.systemClockOffset,
      clientId: state.clientId,
      credentials: {
        accessKeyId: state.accessKey,
        secretAccessKey: state.secretAccessKey,
        sessionToken: state.sessionToken || null,
      },
    });

    console.log("Creating ICE server configuration...");
    const kinesisVideoSignalingChannelsClient =
      new KinesisVideoSignalingChannels({
        region: state.region,
        endpoint: endpointsByProtocol.HTTPS,
        correctClockSkew: true,
        accessKeyId: state.accessKey,
        secretAccessKey: state.secretAccessKey,
        sessionToken: state.sessionToken || null,
      });

    console.log("Getting ICE server config response...");
    const getIceServerConfigResponse = await kinesisVideoSignalingChannelsClient
      .getIceServerConfig({
        ChannelARN: channelARN,
      })
      .promise();

    const iceServers = [];
    console.log("Getting STUN servers...");
    iceServers.push({
      urls: `stun:stun.kinesisvideo.${state.region}.amazonaws.com:443`,
    });

    console.log("Getting TURN servers...");
    getIceServerConfigResponse.IceServerList.forEach((iceServer) =>
      iceServers.push({
        urls: iceServer.Uris,
        username: iceServer.Username,
        credential: iceServer.Password,
      })
    );
    // }

    const configuration = {
      iceServers,
      iceTransportPolicy: "all",
    };

    const resolution = { width: { ideal: 640 }, height: { ideal: 480 } };

    state.peerConnection = new RTCPeerConnection(configuration);
    if (state.openDataChannel) {
      console.log(`Opened data channel with MASTER.`);
      state.dataChannel =
        state.peerConnection.createDataChannel("kvsDataChannel");
      state.peerConnection.ondatachannel = (event) => {
        event.channel.onmessage = (message) => {
          const timestamp = new Date().toISOString();
          const loggedMessage = `${timestamp} - from MASTER: ${message.data}\n`;
          console.log(loggedMessage);
          state.receivedMessages += loggedMessage;
        };
      };
    }

    state.peerConnectionStatsInterval = setInterval(() => {
      state.peerConnection.getStats().then(onStatsReport);
    }, 1000);

    state.signalingClient.on("open", async () => {
      console.log("[VIEWER] Connected to signaling service");

      console.log("[VIEWER] Creating SDP offer");
      await state.peerConnection.setLocalDescription(
        await state.peerConnection.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        })
      );

      // When trickle ICE is enabled, send the offer now and then send ICE candidates as they are generated. Otherwise wait on the ICE candidates.
      if (state.useTrickleICE) {
        console.log("[VIEWER] Sending SDP offer");
        state.signalingClient.sendSdpOffer(
          state.peerConnection.localDescription
        );
      }
      console.log("[VIEWER] Generating ICE candidates");
    });

    state.signalingClient.on("sdpAnswer", async (answer) => {
      // Add the SDP answer to the peer connection
      console.log("[VIEWER] Received SDP answer");
      await state.peerConnection.setRemoteDescription(answer);
    });

    state.signalingClient.on("iceCandidate", (candidate) => {
      // Add the ICE candidate received from the MASTER to the peer connection
      console.log("[VIEWER] Received ICE candidate");
      state.peerConnection.addIceCandidate(candidate);
    });

    state.signalingClient.on("close", () => {
      console.log("[VIEWER] Disconnected from signaling channel");
    });

    state.signalingClient.on("error", (error) => {
      console.error("[VIEWER] Signaling client error: ", error);
    });

    // Send any ICE candidates to the other peer
    state.peerConnection.addEventListener("icecandidate", ({ candidate }) => {
      if (candidate) {
        console.log("[VIEWER] Generated ICE candidate");

        // When trickle ICE is enabled, send the ICE candidates as they are generated.
        if (state.useTrickleICE) {
          console.log("[VIEWER] Sending ICE candidate");
          state.signalingClient.sendIceCandidate(candidate);
        }
      } else {
        console.log("[VIEWER] All ICE candidates have been generated");

        // When trickle ICE is disabled, send the offer now that all the ICE candidates have ben generated.
        if (!state.useTrickleICE) {
          console.log("[VIEWER] Sending SDP offer");
          state.signalingClient.sendSdpOffer(
            state.peerConnection.localDescription
          );
        }
      }
    });

    // As remote tracks are received, add them to the remote view
    state.peerConnection.addEventListener("track", (event) => {
      console.log("[VIEWER] Received remote track");
      if (state.remoteView.current.srcObject) {
        return;
      }
      state.remoteStream = event.streams[0];
      state.remoteView.current.srcObject = state.remoteStream;
    });

    console.log("[VIEWER] Starting viewer connection");
    state.signalingClient.open();
  }

  function stopPlayerForViewer() {
    console.log("[VIEWER] Stopping viewer connection");
    if (state.signalingClient) {
      state.signalingClient.close();
      state.signalingClient = null;
    }

    if (state.peerConnection) {
      state.peerConnection.close();
      state.peerConnection = null;
    }

    if (state.localStream) {
      state.localStream.getTracks().forEach((track) => track.stop());
      state.localStream = null;
    }

    if (state.remoteStream) {
      state.remoteStream.getTracks().forEach((track) => track.stop());
      state.remoteStream = null;
    }

    if (state.peerConnectionStatsInterval) {
      clearInterval(state.peerConnectionStatsInterval);
      state.peerConnectionStatsInterval = null;
    }

    if (state.remoteView.current) {
      state.remoteView.current.srcObject = null;
    }

    if (state.dataChannel) {
      state.dataChannel = null;
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
      }}
    >
      {state.playerIsStarted ? <VideoPlayers state={state} /> : null}
    </Box>
  );
});

//------------------------------------------------------------------------------
const VideoPlayers = view(({ state }) => {
  return (
    <div
      id="video-players"
      className="d-none"
      style={{ width: "100%", height: "100%" }}
    >
      <video
        style={{ width: "100%", height: "100%" }}
        className="return-view"
        ref={state.remoteView}
        autoPlay
        playsInline
        controls
        muted
      />
    </div>
  );
});

function onStatsReport(report) {}

function getRandomClientId() {
  return Math.random().toString(36).substring(2).toUpperCase();
}

export default KinesisWebRTC;
