import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiEndpointCalls from "../utils/apiCalls/apiEndpointCalls";
import { LoginFields, RegisterFields } from "../types/auth";

export function useRegisterUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: RegisterFields) => apiEndpointCalls.signUp(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllUsers"]})
    }
  })
}

export function useLoginUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: LoginFields) => apiEndpointCalls.signIn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllUsers"]})
    }
  })
}

export function useSignOutUser() {
  return useMutation({
    mutationFn: () => apiEndpointCalls.signOut(),
  })
}

export function useGetActiveUsers() {
  return useQuery({
    queryKey: ["ActiveUsers"],
    queryFn: () => apiEndpointCalls.getActiveUsers()
  })
}