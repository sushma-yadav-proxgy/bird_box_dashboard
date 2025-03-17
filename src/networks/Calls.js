import { BIRD_BOX_API_ENDPOINTS } from "src/URLConstants";
import BirdBoxApiCallerInstance from "src/utils/BirdBoxApiCallerInstance";

export const SendCallRequest = async (deviceId, action) => {
  try {
    const actionType = action ? "start" : "stop";

    const response = await BirdBoxApiCallerInstance.post(
      `${BIRD_BOX_API_ENDPOINTS?.CALL_REQUEST}?deviceId=${deviceId}&action=${actionType}`
    );

    return response?.data;
  } catch (error) {
    console.error("Error in SendCallRequest:", error);
    throw error;
  }
};
