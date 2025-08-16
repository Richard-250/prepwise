"use client";

// import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLoading } from "@/lib/context/LoadingContext";
import { useNavigationLoading } from "@/hooks/useNavigationLoading";

const Navigation = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoading } = useLoading();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="shadow-2xl backdrop-blur-md border-b border-amber-200 sticky top-0 z-50 rounded-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <EnhancedNavLink
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Image src="/logo.svg" alt="PrepWise Logo" width={38} height={32} />
            <h2 className="text-2xl font-bold text-primary-100">PrepWise</h2>
          </EnhancedNavLink>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/" label="Home" pathname={pathname} />
            <NavLink
              href="/interviews"
              label="Interviews"
              pathname={pathname}
            />
            <NavLink href="/about" label="About" pathname={pathname} />
            <NavLink href="/contact" label="Contact" pathname={pathname} />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-gray-700 focus:outline-none focus:text-gray-700 p-2"
              aria-label="Toggle mobile menu"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      isMobileMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && !isLoading && (
          <div className="md:hidden pb-4 border-t border-gray-200 mt-4 pt-4">
            <div className="flex flex-col space-y-2">
              <NavLink
                href="/"
                label="Home"
                pathname={pathname}
                mobile
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <NavLink
                href="/interviews"
                label="Interviews"
                pathname={pathname}
                mobile
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <NavLink
                href="/about"
                label="About"
                pathname={pathname}
                mobile
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <NavLink
                href="/contact"
                label="Contact"
                pathname={pathname}
                mobile
                onClick={() => setIsMobileMenuOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Loading indicator in navigation */}
        {isLoading && (
          <div className="absolute top-full left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-pulse"></div>
        )}
      </div>
    </nav>
  );
};

// Enhanced Navigation Link Component with Loading
const EnhancedNavLink = ({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) => {
  const { navigateWithLoading } = useNavigationLoading();
  const { isLoading } = useLoading();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoading) {
      navigateWithLoading(href);
    }
  };

  return (
    <a
      href={href}
      className={`${className} ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={handleClick}
    >
      {children}
    </a>
  );
};

// Updated Navigation Link Component with Loading Support
const NavLink = ({
  href,
  label,
  pathname,
  mobile = false,
  onClick,
}: {
  href: string;
  label: string;
  pathname: string;
  mobile?: boolean;
  onClick?: () => void;
}) => {
  const { navigateWithLoading } = useNavigationLoading();
  const { isLoading } = useLoading();
  const isActive = pathname === href;

  const baseClasses = mobile
    ? "block px-3 py-2 text-base font-medium rounded-md transition-colors"
    : "text-sm font-medium text-white/50 hover:text-primary-100 py-2";

  const activeClasses = mobile
    ? "text-primary-100 bg-primary-10"
    : "text-primary-100 border-b-2 border-primary-100";

  const inactiveClasses = mobile
    ? "text-gray-700 hover:text-primary-100 hover:bg-gray-50"
    : "text-gray-700 hover:text-primary-100";

  const loadingClasses = isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer";

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoading) {
      if (onClick) onClick();
      navigateWithLoading(href);
    }
  };

  return (
    <a
      href={href}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${loadingClasses} transition-all duration-200`}
      onClick={handleClick}
    >
      <span className="flex items-center gap-2">
        {label}
        {isLoading && pathname !== href && (
          <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin "></div>
        )}
      </span>
    </a>
  );
};

export default Navigation;