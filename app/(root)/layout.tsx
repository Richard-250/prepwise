import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/actions/auth.action";
import { LoadingProvider } from "@/lib/context/LoadingContext";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import EnhancedNavigation from "@/components/navigation";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  return (
    <LoadingProvider>
      <div className="root-layout bg-gradient-to-br min-h-screen">
        <LoadingOverlay>
          <>
            <EnhancedNavigation />
            
            <main className="min-h-screen">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-amber-200/50 dark:border-amber-800/50 mt-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="flex items-center gap-3 mb-4 md:mb-0">
                    <Image src="/logo.svg" alt="PrepWise Logo" width={32} height={28} />
                    <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      PrepWise
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    © 2025 PrepWise. All rights reserved.
                  </div>
                </div>
              </div>
            </footer>
          </>
        </LoadingOverlay>
      </div>
    </LoadingProvider>
  );
};

export default Layout;