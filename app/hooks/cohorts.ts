import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiEndpointCalls from "../utils/apiCalls/apiEndpointCalls";
import { CohortFormData } from "../types/cohort";

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

export function useAddCohort() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CohortFormData) => apiEndpointCalls.addCohort(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetAllCohorts"]})
    }
  })
}

export function useGetCurrentCohort() {
  return useQuery({
    queryKey: ["CurrentCohort"],
    queryFn: () => apiEndpointCalls.getCurrentCohort()
  })
}
