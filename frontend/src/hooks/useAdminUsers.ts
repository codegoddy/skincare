import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService, AdminUser, AdminUserListResponse } from '@/lib/api/admin';
import { toast } from '@/stores/toast';

// Query keys
export const adminKeys = {
  all: ['admin'] as const,
  users: () => [...adminKeys.all, 'users'] as const,
  usersList: (page: number, pageSize: number) => [...adminKeys.users(), { page, pageSize }] as const,
  user: (id: string) => [...adminKeys.users(), id] as const,
};

// Get users list
export function useAdminUsers(page: number = 1, pageSize: number = 20) {
  return useQuery({
    queryKey: adminKeys.usersList(page, pageSize),
    queryFn: () => adminService.getUsers(page, pageSize),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Get single user
export function useAdminUser(userId: string) {
  return useQuery({
    queryKey: adminKeys.user(userId),
    queryFn: () => adminService.getUser(userId),
    enabled: !!userId,
  });
}

// Update user role
export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      adminService.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      toast.success('User role updated');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update role');
    },
  });
}

// Update user status
export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: string }) =>
      adminService.updateUserStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      toast.success('User status updated');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update status');
    },
  });
}

// Store Settings
export function useStoreSettings() {
  return useQuery({
    queryKey: [...adminKeys.all, 'storeSettings'] as const,
    queryFn: () => adminService.getStoreSettings(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useUpdateStoreSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof adminService.updateStoreSettings>[0]) =>
      adminService.updateStoreSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...adminKeys.all, 'storeSettings'] });
      toast.success('Settings saved');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to save settings');
    },
  });
}
