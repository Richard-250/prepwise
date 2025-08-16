'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  startPageTransition: () => void;
  finishPageTransition: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  // Auto-handle page transitions
  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const startPageTransition = () => {
    setIsLoading(true);
  };

  const finishPageTransition = () => {
    setIsLoading(false);
  };

  return (
    <LoadingContext.Provider value={{
      isLoading,
      setLoading,
      startPageTransition,
      finishPageTransition
    }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};