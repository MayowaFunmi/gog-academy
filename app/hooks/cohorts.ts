import { useQuery } from "@tanstack/react-query";
import apiEndpointCalls from "../utils/apiCalls/apiEndpointCalls";

export function useGetAllCohorts() {
  return useQuery({
    queryKey: ["GetAllCohorts"],
    queryFn: () => apiEndpointCalls.getAllCohorts()
  })
}

export function useGetCohortById(cohortId: string) {
  return useQuery({
    queryKey: ["GetCohortById", cohortId],
    queryFn: () => apiEndpointCalls.getCohortById(cohortId),
    enabled: !!cohortId
  })
}