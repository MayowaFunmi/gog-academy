import { useQuery } from "@tanstack/react-query";
import apiEndpointCalls from "../utils/apiCalls/apiEndpointCalls";

export function useGetWeeklyReport(weekId: string) {
  return useQuery({
    queryKey: ["WeeklyReport", weekId],
    queryFn: () => apiEndpointCalls.getWeeklyReport(weekId),
    enabled: !!weekId
  })
}