/**
 * Auth hooks using TanStack Query
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService, LoginRequest, SignupRequest, ForgotPasswordRequest } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import { toast } from '@/stores/toast';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

// Get current user
export function useCurrentUser() {
  const { setUser } = useAuthStore();
  
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      const user = await authService.getMe();
      setUser(user);
      return user;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  const router = useRouter();
  
  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      setUser(response.user);
      queryClient.setQueryData(authKeys.user(), response.user);
      toast.success('Welcome back!');
      
      // Redirect based on role - admins go to admin dashboard
      if (response.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    },
  });
}

// Signup mutation
export function useSignup() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  const router = useRouter();
  
  return useMutation({
    mutationFn: (data: SignupRequest) => authService.signup(data),
    onSuccess: (response) => {
      setUser(response.user);
      queryClient.setQueryData(authKeys.user(), response.user);
      toast.success('Account created successfully!');
      router.push('/');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Signup failed');
    },
  });
}

// Logout mutation
export function useLogout() {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();
  const router = useRouter();
  
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout();
      queryClient.removeQueries({ queryKey: authKeys.all });
      toast.info('You have been logged out');
      router.push('/login');
    },
    onError: () => {
      // Even if logout fails on server, clear local state
      logout();
      queryClient.removeQueries({ queryKey: authKeys.all });
      router.push('/login');
    },
  });
}

// Forgot password mutation
export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authService.forgotPassword(data),
    onSuccess: () => {
      toast.success('Password reset link sent to your email');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Request failed');
    },
  });
}

// Refresh token mutation
export function useRefreshToken() {
  const queryClient = useQueryClient();
  const { setUser, logout } = useAuthStore();
  
  return useMutation({
    mutationFn: () => authService.refreshToken(),
    onSuccess: (response) => {
      setUser(response.user);
      queryClient.setQueryData(authKeys.user(), response.user);
    },
    onError: () => {
      logout();
      queryClient.removeQueries({ queryKey: authKeys.all });
      toast.warning('Session expired. Please log in again.');
    },
  });
}
