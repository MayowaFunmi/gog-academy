import { AuthResponse, LoginFields, RegisterFields } from "@/app/types/auth";
import { apiClient } from "./application";
import { CohortsResponse, SingleCohortResponse } from "@/app/types/cohort";

const signIn = async (data: LoginFields): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post("/api/auth/login", data);

    return response.data as AuthResponse;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

const signUp = async (data: RegisterFields): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post("/api/auth/register", data);
    return response.data as AuthResponse;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

const getAllCohorts = async (): Promise<CohortsResponse> => {
  try {
    const response = await apiClient.get("/api/cohorts/get-all");
    return response.data as CohortsResponse;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

const getCohortById = async(cohortId: string): Promise<SingleCohortResponse> => {
  try {
    const response = await apiClient.get(`/api/cohorts/${cohortId}`);
    return response.data as SingleCohortResponse;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}

const signOut = async () => {
  try {
    const response = await apiClient.post("/api/auth/logout");
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

const apiEndpointCalls = {
  signIn,
  signUp,
  signOut,
  getAllCohorts,
  getCohortById
};

export default apiEndpointCalls;
