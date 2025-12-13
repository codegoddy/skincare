/**
 * Profile hooks using TanStack Query
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileService, UpdateProfileRequest } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import { toast } from '@/stores/toast';

// Query keys
export const profileKeys = {
  all: ['profile'] as const,
  detail: () => [...profileKeys.all, 'detail'] as const,
};

// Get current user profile
export function useProfile() {
  const { setUser } = useAuthStore();
  
  return useQuery({
    queryKey: profileKeys.detail(),
    queryFn: async () => {
      const profile = await profileService.getProfile();
      setUser(profile);
      return profile;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Update profile mutation
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => profileService.updateProfile(data),
    onSuccess: (profile) => {
      setUser(profile);
      queryClient.setQueryData(profileKeys.detail(), profile);
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Update failed');
    },
  });
}

// Change password mutation
export function useChangePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      profileService.changePassword(currentPassword, newPassword),
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Password change failed');
    },
  });
}
