import React from 'react';
import { cn } from '@/lib/utils';

// ============================================
// SPINNER COMPONENT
// ============================================

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: 'primary' | 'secondary' | 'white' | 'current';
}

const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  className, 
  color = 'primary' 
}) => {
  const sizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const colors = {
    primary: 'text-[#00b67a]',
    secondary: 'text-slate-500',
    white: 'text-white',
    current: 'text-current',
  };

  return (
    <svg
      className={cn(
        'animate-spin',
        sizes[size],
        colors[color],
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Loading"
      role="status"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

// ============================================
// LOADING OVERLAY COMPONENT
// ============================================

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  message?: string;
  className?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  message = 'Loading...',
  className,
}) => {
  return (
    <div className={cn('relative', className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-2">
            <Spinner size="lg" />
            <p className="text-sm text-slate-600">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// SKELETON COMPONENT
// ============================================

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number; // For text variant
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
  lines = 1,
}) => {
  const baseStyles = 'animate-pulse bg-slate-200';

  if (variant === 'text') {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseStyles,
              'h-4 rounded',
              index === lines - 1 && lines > 1 && 'w-3/4', // Last line shorter
              className
            )}
            style={{ width, height }}
          />
        ))}
      </div>
    );
  }

  const variantStyles = {
    circular: 'rounded-full',
    rectangular: 'rounded',
  };

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        className
      )}
      style={{ width, height }}
    />
  );
};

// ============================================
// EXPORTS
// ============================================

export { Spinner, LoadingOverlay, Skeleton };
export type { SpinnerProps, LoadingOverlayProps, SkeletonProps };
