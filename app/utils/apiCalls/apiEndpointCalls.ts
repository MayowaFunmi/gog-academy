import { AuthResponse, LoginFields, RegisterFields } from "@/app/types/auth";
import { apiClient } from "./application";

const signIn = async (data: LoginFields): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post("/api/auth/login", data);
    return response.data as AuthResponse
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}

const signUp = async (data: RegisterFields): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post("/api/auth/register", data)
    return response.data as AuthResponse
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}

const apiEndpointCalls = {
  signIn, signUp
}

export default apiEndpointCalls