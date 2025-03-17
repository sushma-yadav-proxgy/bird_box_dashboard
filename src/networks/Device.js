import { BIRD_BOX_API_ENDPOINTS } from "src/URLConstants";
import BirdBoxApiCallerInstance from "src/utils/BirdBoxApiCallerInstance";

export const GetAllDevices = async () => {
  try {
    const response = await BirdBoxApiCallerInstance.get(
      `${BIRD_BOX_API_ENDPOINTS.GET_ALL_DEVICES}?page=1&limit=50`
    );
    return response.data;
  } catch (error) {
    console.log("Error while fetching device data", error);
  }
};
