import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

/**
 * Hook để wait for auth store hydration
 * Zustand persist middleware cần thời gian để load từ localStorage
 */
export function useAuthHydration() {
  const [isHydrated, setIsHydrated] = useState(false);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isAdmin = useAuthStore((state) => state.isAdmin);

  useEffect(() => {
    // Log khởi tạo
    console.log('🔄 useAuthHydration - Component mounted');
    console.log('📋 Initial user from store:', user);
    console.log('📋 Initial token from store:', token ? `${token.substring(0, 20)}...` : null);
    console.log('📋 localStorage token:', localStorage.getItem('token') ? `${localStorage.getItem('token')!.substring(0, 20)}...` : null);

    // Đặt một timeout nhỏ để cho Zustand hydrate
    const timer = setTimeout(() => {
      console.log('✅ useAuthHydration - Hydration complete');
      console.log('📋 Final user from store:', user);
      console.log('📋 Final token from store:', token ? `${token.substring(0, 20)}...` : null);
      setIsHydrated(true);
    }, 100);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isHydrated,
    user,
    token,
    isAuthenticated: !!user && !!token,
    isAdmin,
  };
}



