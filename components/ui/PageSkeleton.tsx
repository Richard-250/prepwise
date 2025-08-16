"use client"; 
// 3. Universal Page Skeleton (components/ui/PageSkeleton.tsx)
import { FuturisticSkeleton } from "./FuturisticSkeleton";

export const UniversalPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br">
      {/* Header Skeleton */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FuturisticSkeleton variant="avatar" />
              <FuturisticSkeleton className="h-6 w-32" />
            </div>
            <div className="flex items-center gap-3">
              <FuturisticSkeleton variant="button" className="w-20" />
              <FuturisticSkeleton variant="button" className="w-24" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <FuturisticSkeleton className="h-8 w-64 mb-2" />
          <FuturisticSkeleton variant="text" lines={2} className="w-96" />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
              <FuturisticSkeleton variant="card" className="mb-4" />
              <FuturisticSkeleton className="h-5 w-3/4 mb-2" />
              <FuturisticSkeleton variant="text" lines={3} />
              <div className="flex gap-2 mt-4">
                <FuturisticSkeleton variant="button" className="w-20" />
                <FuturisticSkeleton variant="button" className="w-24" />
              </div>
            </div>
          ))}
        </div>

        {/* Additional Content */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-8 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
          <FuturisticSkeleton className="h-6 w-48 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <FuturisticSkeleton variant="text" lines={5} />
            </div>
            <div>
              <FuturisticSkeleton variant="card" className="h-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Elements */}
      <div className="fixed bottom-8 right-8 space-y-4">
        <FuturisticSkeleton className="h-12 w-12 rounded-full" />
        <FuturisticSkeleton className="h-10 w-10 rounded-full" />
      </div>

      {/* Loading Indicator */}
      {/* <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
          <span className="text-gray-700 dark:text-gray-300 font-medium">Loading...</span>
        </div>
      </div> */}
    </div>
  );
};
