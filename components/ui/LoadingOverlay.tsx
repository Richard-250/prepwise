"use client"; 
// 4. Loading Overlay Component (components/ui/LoadingOverlay.tsx)
import { useLoading } from "@/lib/context/LoadingContext";
import { UniversalPageSkeleton } from "./PageSkeleton";

export const LoadingOverlay = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useLoading();

  if (isLoading) {
    return <UniversalPageSkeleton />;
  }

  return <>{children}</>;
};
