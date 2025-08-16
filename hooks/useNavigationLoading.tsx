
// 5. Custom Hook for Navigation (hooks/useNavigationLoading.tsx)
'use client';

import { useRouter } from 'next/navigation';
import { useLoading } from '@/lib/context/LoadingContext';
import { useCallback } from 'react';

export const useNavigationLoading = () => {
  const router = useRouter();
  const { startPageTransition } = useLoading();

  const navigateWithLoading = useCallback((path: string) => {
    startPageTransition();
    router.push(path);
  }, [router, startPageTransition]);

  const replaceWithLoading = useCallback((path: string) => {
    startPageTransition();
    router.replace(path);
  }, [router, startPageTransition]);

  return {
    navigateWithLoading,
    replaceWithLoading
  };
};

