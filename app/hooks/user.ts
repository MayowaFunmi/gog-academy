import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiEndpointCalls from "../utils/apiCalls/apiEndpointCalls";
import { ProfileForm } from "../types/user";

export function useGetUserMe() {
  return useQuery({
    queryKey: ["MyUserDetails"],
    queryFn: () => apiEndpointCalls.getUserMe()
  })
}

export function useCreateUserProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ProfileForm) => apiEndpointCalls.createUserProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["MyUserDetails"]}) // for get user profile view
    }
  })
}

