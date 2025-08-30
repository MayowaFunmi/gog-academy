import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DailyTaskFormData, TaskTypeFormData } from "../types/task";
import apiEndpointCalls from "../utils/apiCalls/apiEndpointCalls";

export function useAddTaskCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TaskTypeFormData) =>
      apiEndpointCalls.addTaskCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetAllTaskCategories"] });
    },
  });
}

export function useGetCohortTaskCategories(cohortId: string) {
  return useQuery({
    queryKey: ["GetCohortTaskCategories", cohortId],
    queryFn: () => apiEndpointCalls.getCohortTaskCategories(cohortId),
    enabled: !!cohortId,
  });
}

export function useAddDailyTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DailyTaskFormData) =>
      apiEndpointCalls.addDailyTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetWeeklyTasks"] });
    },
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => apiEndpointCalls.updateTaskStatus(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetWeeklyTasks"] });
    },
  });
}

export function useApproveSubmission(taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (submissionId: string) => apiEndpointCalls.approveSubmission(submissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetTaskDetails", taskId] });
    },
  });
}

export function useGetWeeklyTasks(weekId: string) {
  return useQuery({
    queryKey: ["GetWeeklyTasks", weekId],
    queryFn: () => apiEndpointCalls.getWeeklyTasks(weekId),
    enabled: !!weekId,
  });
}

export function useGetTaskById(
  taskId: string,
  role: string,
  attendancePage?: string,
  attendancePageSize?: string,
  submissionPage?: string,
  submissionPageSize?: string
) {
  return useQuery({
    queryKey: ["GetTaskDetails", taskId],
    queryFn: () => {
      if (role === "SuperAdmin") {
        // Build params object dynamically
        const params: Record<string, string> = {};
        if (attendancePage) params.attendancePage = attendancePage;
        if (attendancePageSize) params.attendancePageSize = attendancePageSize;
        if (submissionPage) params.submissionPage = submissionPage;
        if (submissionPageSize) params.submissionPageSize = submissionPageSize;

        return apiEndpointCalls.getTaskById(
          taskId,
          params?.attendancePage,
          params?.attendancePageSize,
          params?.submissionPage,
          params?.attendancePageSize
        );
      }

      return apiEndpointCalls.getStudentTaskDetail(taskId);
    },
    enabled: !!taskId && !!role,
  });
}

export function useTaskSubmit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => apiEndpointCalls.submitTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetTaskDetails"] });
    },
  });
}

export function useGetUserTaskSubmission(taskId: string) {
  return useQuery({
    queryKey: ["GetTaskDetails"],
    queryFn: () => apiEndpointCalls.getUserTaskSubmission(taskId),
    enabled: !!taskId,
  });
}
