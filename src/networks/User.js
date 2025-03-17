import { BIRD_BOX_API_ENDPOINTS } from "src/URLConstants";
import BirdBoxApiCallerInstance from "src/utils/BirdBoxApiCallerInstance";

export const AdminLogout = async () => {
  const response = await BirdBoxApiCallerInstance.post(
    BIRD_BOX_API_ENDPOINTS.ADMIN_LOGOUT
  );
  return response;
};
