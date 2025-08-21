import { type ClassValue, clsx } from 'clsx';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ThemeConfig, CarrouselConfig } from './types';

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Merges class names using clsx
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Formats a date string to a readable format
 */
export function formatDate(
  dateString: string,
  formatString: string = 'MMM dd, yyyy'
): string {
  try {
    const date = parseISO(dateString);
    return format(date, formatString);
  } catch {
    return 'Invalid date';
  }
}

/**
 * Formats a date string to relative time (e.g., "2 days ago")
 */
export function formatRelativeDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'Invalid date';
  }
}

/**
 * Truncates text to a specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Validates if a string is a valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates if a domain is valid
 */
export function isValidDomain(domain: string): boolean {
  const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;
  return domainRegex.test(domain);
}

/**
 * Sanitizes HTML content to prevent XSS
 */
export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - in production, consider using DOMPurify
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Debounces a function call
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function(this: any, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Throttles a function call
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Creates a delay/sleep function
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generates a random ID
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Deep merges two objects
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || ({} as any), source[key]);
    } else if (source[key] !== undefined) {
      result[key] = source[key] as T[Extract<keyof T, string>];
    }
  }
  
  return result;
}

// ============================================
// THEME UTILITIES
// ============================================

/**
 * Default light theme configuration
 */
export const lightTheme: ThemeConfig = {
  colors: {
    primary: '#00b67a',      // Trustpilot Green
    secondary: '#dcdce6',    // Light Gray
    accent: '#ff3722',       // Red for low ratings
    warning: '#ffb829',      // Yellow for medium ratings
    success: '#10b981',      // Green for success
    error: '#ef4444',        // Red for errors
    background: '#ffffff',   // White
    surface: '#f7f8fc',      // Light background
    text: '#191919',         // Dark text
    textSecondary: '#666666', // Gray text
    border: '#e5e7eb',       // Light border
    star: '#ffc107',         // Star color
    starEmpty: '#e5e7eb',    // Empty star color
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    sizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.5rem',     // 24px
    },
  },
  spacing: {
    xs: '0.25rem',      // 4px
    sm: '0.5rem',       // 8px
    md: '1rem',         // 16px
    lg: '1.5rem',       // 24px
    xl: '2rem',         // 32px
  },
  borderRadius: {
    sm: '0.25rem',      // 4px
    md: '0.5rem',       // 8px
    lg: '0.75rem',      // 12px
    full: '9999px',     // Full rounded
  },
};

/**
 * Default dark theme configuration
 */
export const darkTheme: ThemeConfig = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    success: '#34d399',      // Lighter green for dark theme
    error: '#f87171',        // Lighter red for dark theme
    background: '#1a1a1a',   // Dark background
    surface: '#2d2d2d',      // Dark surface
    text: '#ffffff',         // White text
    textSecondary: '#a1a1a1', // Light gray text
    border: '#404040',       // Dark border
    starEmpty: '#404040',    // Dark empty star
  },
};

/**
 * Gets theme configuration based on theme name
 */
export function getTheme(themeName: 'light' | 'dark'): ThemeConfig {
  return themeName === 'dark' ? darkTheme : lightTheme;
}

// ============================================
// CAROUSEL UTILITIES
// ============================================

/**
 * Calculates slides per view based on screen width
 */
export function getSlidesPerView(width: number): number {
  if (width < 640) return 1;      // Mobile
  if (width < 1024) return 2;     // Tablet
  return 3;                       // Desktop
}

/**
 * Calculates carousel height based on content
 */
export function getCarouselHeight(config: CarrouselConfig): number {
  const baseHeight = config.height || 400;
  const minHeight = 300;
  const maxHeight = 600;
  
  return Math.max(minHeight, Math.min(maxHeight, baseHeight));
}

// ============================================
// RATING UTILITIES
// ============================================

/**
 * Gets color based on rating value
 */
export function getRatingColor(rating: number, theme: ThemeConfig): string {
  if (rating >= 4) return theme.colors.primary;    // Green for 4-5 stars
  if (rating >= 3) return theme.colors.warning;    // Yellow for 3-4 stars
  return theme.colors.accent;                       // Red for 1-3 stars
}

/**
 * Gets rating text description
 */
export function getRatingText(rating: number): string {
  if (rating >= 4.5) return 'Excellent';
  if (rating >= 4) return 'Great';
  if (rating >= 3) return 'Average';
  if (rating >= 2) return 'Poor';
  return 'Bad';
}

/**
 * Formats rating value for display
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

// ============================================
// ERROR HANDLING UTILITIES
// ============================================

/**
 * Creates a standardized error object
 */
export function createError(
  code: string,
  message: string,
  status?: number,
  details?: any
): Error & { code: string; status?: number; details?: any } {
  const error = new Error(message) as Error & { 
    code: string; 
    status?: number; 
    details?: any; 
  };
  error.code = code;
  if (status) error.status = status;
  if (details) error.details = details;
  return error;
}

/**
 * Checks if an error is a specific type
 */
export function isApiError(error: unknown, code?: string): boolean {
  if (!(error instanceof Error)) return false;
  const apiError = error as Error & { code?: string };
  if (code) return apiError.code === code;
  return Boolean(apiError.code);
}

// ============================================
// PERFORMANCE UTILITIES
// ============================================

/**
 * Creates a simple cache implementation
 */
export class SimpleCache<T = any> {
  private cache = new Map<string, { value: T; expires: number }>();
  private defaultTTL: number;

  constructor(defaultTTL: number = 5 * 60 * 1000) { // 5 minutes default
    this.defaultTTL = defaultTTL;
  }

  set(key: string, value: T, ttl?: number): void {
    const expires = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { value, expires });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}
