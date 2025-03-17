import { BIRD_BOX_API_ENDPOINTS } from "src/URLConstants";
import BirdBoxApiCallerInstance from "src/utils/BirdBoxApiCallerInstance";

export const ControlTelescope = async (deviceId, command) => {
  try {
    const response = await BirdBoxApiCallerInstance.post(
      `${BIRD_BOX_API_ENDPOINTS?.TELESCOPE_MOVEMENT}?deviceId=${deviceId}&action=${command}`
    );

    return response?.data;
  } catch (error) {
    console.error("Error in Telescope Command:", error);
    throw error;
  }
};
