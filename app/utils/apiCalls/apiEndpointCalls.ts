import { AuthResponse, LoginFields, RegisterFields } from "@/app/types/auth";
import { apiClient } from "./application";
import { ActiveCohortResponse, AddCohortResponse, CohortFormData, CohortsResponse, SingleCohortResponse } from "@/app/types/cohort";

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

const addCohort = async (data: CohortFormData): Promise<AddCohortResponse> => {
  try {
    const response = await apiClient.post("/api/cohorts/create", data);
    return response.data as AddCohortResponse;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}

const getCurrentCohort = async (): Promise<ActiveCohortResponse> => {
  try {
    const response = await apiClient.get("/api/cohorts/active");
    return response.data as ActiveCohortResponse;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}

const apiEndpointCalls = {
  signIn,
  signUp,
  addCohort,
  signOut,
  getAllCohorts,
  getCohortById,
  getCurrentCohort
};

export default apiEndpointCalls;
