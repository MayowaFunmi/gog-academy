import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { DailyTaskFormData, TaskTypeFormData } from "../types/task"
import apiEndpointCalls from "../utils/apiCalls/apiEndpointCalls"

export function useAddTaskCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TaskTypeFormData) => apiEndpointCalls.addTaskCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetAllTaskCategories"]})
    }
  })
}

export function useGetCohortTaskCategories(cohortId: string) {
  return useQuery({
    queryKey: ["GetCohortTaskCategories", cohortId],
    queryFn: () => apiEndpointCalls.getCohortTaskCategories(cohortId),
    enabled: !!cohortId
  })
}

export function useAddDailyTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: DailyTaskFormData) => apiEndpointCalls.addDailyTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetAllDailyTasks"]})
    }
  })
}