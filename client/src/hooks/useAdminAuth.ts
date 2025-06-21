import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface AdminSession {
  isAuthenticated: boolean;
  username?: string;
}

export function useAdminAuth() {
  const { data: session, isLoading } = useQuery<AdminSession>({
    queryKey: ["/api/admin/session"],
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admin/logout");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/session"] });
    },
  });

  return {
    isAuthenticated: session?.isAuthenticated || false,
    username: session?.username,
    isLoading,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}