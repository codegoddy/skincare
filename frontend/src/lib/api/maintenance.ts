/**
 * Maintenance mode utilities
 */

/**
 * Check if the API response indicates maintenance mode
 */
export function isMaintenanceMode(error: any): boolean {
  if (!error) return false;
  
  // Check for 503 status code
  if (error.status === 503) {
    return true;
  }
  
  // Check for maintenance flag in response
  if (error.maintenance === true) {
    return true;
  }
  
  // Check error message
  if (typeof error.detail === 'string' && error.detail.includes('maintenance')) {
    return true;
  }
  
  return false;
}

/**
 * Redirect to maintenance page
 */
export function redirectToMaintenance(): void {
  if (typeof window !== 'undefined' && !window.location.pathname.includes('/maintenance')) {
    window.location.href = '/maintenance';
  }
}

/**
 * Check if current user is admin (to bypass maintenance mode)
 */
export function isAdminUser(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) return false;
    
    const data = JSON.parse(authStorage);
    return data?.state?.user?.role === 'admin';
  } catch {
    return false;
  }
}
