import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService, SettingsResponse, UpdateNotificationsRequest, ChangePasswordRequest } from '@/lib/api/settings';
import { toast } from '@/stores/toast';

// Query keys
export const settingsKeys = {
  all: ['settings'] as const,
  user: () => [...settingsKeys.all, 'user'] as const,
};

// Get settings
export function useSettings() {
  return useQuery({
    queryKey: settingsKeys.user(),
    queryFn: () => settingsService.getSettings(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Update notification settings
export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateNotificationsRequest) => settingsService.updateSettings(data),
    onSuccess: (data) => {
      queryClient.setQueryData(settingsKeys.user(), data);
      toast.success('Settings updated');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update settings');
    },
  });
}

// Change password
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => settingsService.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to change password');
    },
  });
}
