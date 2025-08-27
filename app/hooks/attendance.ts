import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AttendanceFormData } from "../types/attendance"
import apiEndpointCalls from "../utils/apiCalls/apiEndpointCalls"

export function useMarkTaskAttendance() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AttendanceFormData) => apiEndpointCalls.markTaskAttendance(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["GetUserDailyTaskAttendance", variables.taskId]})
    }
  })
}

export function useGetUserDailyTaskAttendance(taskId: string) {
  return useQuery({
    queryKey: ["GetUserDailyTaskAttendance", taskId],
    queryFn: () => apiEndpointCalls.getUserDailyTaskAttendance(taskId),
    enabled: !!taskId
  })
}