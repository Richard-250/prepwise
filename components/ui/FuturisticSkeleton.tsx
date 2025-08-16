"use client"; 
// 2. Futuristic Skeleton Component (components/ui/FuturisticSkeleton.tsx)
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'card' | 'text' | 'avatar' | 'button';
  lines?: number;
}

export const FuturisticSkeleton = ({ 
  className, 
  variant = 'default',
  lines = 1 
}: SkeletonProps) => {
  const baseClasses = "relative overflow-hidden bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-xl";
  
  const variants = {
    default: "h-4",
    card: "h-48 rounded-xl",
    text: "h-4 rounded-md",
    avatar: "h-12 w-12 rounded-full",
    button: "h-10 rounded-lg"
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              variants.text,
              i === lines - 1 ? "w-3/4" : "w-full",
              "animate-pulse bg-size-200 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            )}
            style={{
              backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
              backgroundSize: "200% 100%",
              animation: `shimmer 2s infinite linear`
            }}
          />
        ))}
        <style jsx>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      className={cn(
        baseClasses,
        variants[variant],
        "animate-pulse",
        className
      )}
      style={{
        backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
        backgroundSize: "200% 100%",
        animation: `shimmer 2s infinite linear`
      }}
    >
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};
