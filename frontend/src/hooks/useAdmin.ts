"use client";

import { useQuery } from "@tanstack/react-query";
import { adminService, DashboardResponse } from "@/lib/api/admin";

/**
 * Hook to fetch admin dashboard data
 */
export function useDashboard() {
  return useQuery<DashboardResponse>({
    queryKey: ["admin", "dashboard"],
    queryFn: () => adminService.getDashboard(),
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 60 * 5, // Refresh every 5 minutes
  });
}
