import { useQuery } from "@tanstack/react-query";
import apiEndpointCalls from "../utils/apiCalls/apiEndpointCalls";

export function useGetUserMe() {
  return useQuery({
    queryKey: ["MyUserDetails"],
    queryFn: () => apiEndpointCalls.getUserMe()
  })
}