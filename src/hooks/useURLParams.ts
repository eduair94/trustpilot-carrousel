'use client';

import { DEFAULT_CONFIG, validateConfig } from '@/lib/config';
import { CarrouselConfig, CarrouselConfigSchema } from '@/lib/types';
import { useEffect, useMemo, useState } from 'react';

// ============================================
// URL PARAMS HOOK
// ============================================

export function useURLParams(): {
  config: Required<CarrouselConfig>;
  isValid: boolean;
  errors: string[];
  rawParams: Record<string, string>;
} {
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(
    null
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSearchParams(new URLSearchParams(window.location.search));
    }
  }, []);

  const result = useMemo(() => {
    // Extract all parameters from URL
    const rawParams: Record<string, string> = {};
    if (searchParams) {
      searchParams.forEach((value: string, key: string) => {
        rawParams[key] = value;
      });
    }

    try {
      // Parse and validate with Zod schema
      const parsedConfig = CarrouselConfigSchema.parse(rawParams);

      // Merge with defaults
      const config = {
        ...DEFAULT_CONFIG,
        ...parsedConfig,
      } as Required<CarrouselConfig>;

      // Additional validation
      const validationErrors = validateConfig(config);

      return {
        config,
        isValid: validationErrors.length === 0,
        errors: validationErrors,
        rawParams,
      };
    } catch (error) {
      // Handle Zod validation errors
      if (error && typeof error === 'object' && 'errors' in error) {
        const zodError = error as {
          errors: Array<{ message: string; path: string[] }>;
        };
        const errors = zodError.errors.map(
          err => `${err.path.join('.')}: ${err.message}`
        );

        return {
          config: DEFAULT_CONFIG,
          isValid: false,
          errors,
          rawParams,
        };
      }

      return {
        config: DEFAULT_CONFIG,
        isValid: false,
        errors: ['Invalid URL parameters'],
        rawParams,
      };
    }
  }, [searchParams]);

  return result;
}

// ============================================
// UTILITY HOOKS
// ============================================

/**
 * Hook to get a specific URL parameter
 */
export function useURLParam(key: string): string | null {
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(
    null
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSearchParams(new URLSearchParams(window.location.search));
    }
  }, []);

  return searchParams?.get(key) || null;
}

/**
 * Hook to check if running in iframe
 */
export function useIsIframe(): boolean {
  return useMemo(() => {
    if (typeof window === 'undefined') return false;
    try {
      return window.self !== window.top;
    } catch {
      return true; // If we can't access window.top, we're probably in an iframe
    }
  }, []);
}

/**
 * Hook to get iframe dimensions
 */
export function useIframeDimensions(): {
  width: number;
  height: number;
} {
  const isIframe = useIsIframe();

  return useMemo(() => {
    if (!isIframe || typeof window === 'undefined') {
      return { width: 0, height: 0 };
    }

    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }, [isIframe]);
}

/**
 * Hook to detect mobile device
 */
export function useIsMobile(): boolean {
  return useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }, []);
}

/**
 * Hook to get responsive slides per view
 */
export function useSlidesPerView(): number {
  return useMemo(() => {
    if (typeof window === 'undefined') return 1;

    const width = window.innerWidth;
    if (width < 640) return 1; // Mobile
    if (width < 1024) return 2; // Tablet
    return 3; // Desktop
  }, []);
}

// ============================================
// PARAMETER PARSING UTILITIES
// ============================================

/**
 * Parses boolean parameter from string
 */
export function parseBoolean(
  value: string | null,
  defaultValue: boolean = false
): boolean {
  if (!value) return defaultValue;
  const lowercased = value.toLowerCase();
  return lowercased === 'true' || lowercased === '1' || lowercased === 'yes';
}

/**
 * Parses number parameter from string
 */
export function parseNumber(
  value: string | null,
  defaultValue: number = 0,
  min?: number,
  max?: number
): number {
  if (!value) return defaultValue;

  const parsed = parseFloat(value);
  if (isNaN(parsed)) return defaultValue;

  let result = parsed;
  if (min !== undefined) result = Math.max(min, result);
  if (max !== undefined) result = Math.min(max, result);

  return result;
}

/**
 * Parses enum parameter from string
 */
export function parseEnum<T extends string>(
  value: string | null,
  allowedValues: readonly T[],
  defaultValue: T
): T {
  if (!value) return defaultValue;

  const found = allowedValues.find(
    allowed => allowed.toLowerCase() === value.toLowerCase()
  );

  return found || defaultValue;
}

// ============================================
// CONFIGURATION HELPERS
// ============================================

/**
 * Creates a configuration object from URL search params
 */
export function createConfigFromParams(
  params: URLSearchParams
): Partial<CarrouselConfig> {
  const config: Partial<CarrouselConfig> = {};

  // Required domain
  const domain = params.get('domain');
  if (domain) config.domain = domain;

  // Optional parameters
  const page = params.get('page');
  if (page) config.page = parseNumber(page, 1, 1);

  const autoplay = params.get('autoplay');
  if (autoplay !== null) config.autoplay = parseBoolean(autoplay, true);

  const interval = params.get('interval');
  if (interval) config.interval = parseNumber(interval, 5000, 1000, 30000);

  const theme = params.get('theme');
  if (theme)
    config.theme = parseEnum(
      theme,
      ['light', 'dark', 'custom'] as const,
      'light'
    );

  const maxReviews = params.get('maxReviews');
  if (maxReviews) config.maxReviews = parseNumber(maxReviews, 10, 1, 50);

  const minRating = params.get('minRating');
  if (minRating)
    config.minRating = parseNumber(minRating, 1, 1, 5) as 1 | 2 | 3 | 4 | 5;

  const language = params.get('language');
  if (language) config.language = language;

  const showRating = params.get('showRating');
  if (showRating !== null) config.showRating = parseBoolean(showRating, true);

  const showDate = params.get('showDate');
  if (showDate !== null) config.showDate = parseBoolean(showDate, true);

  const showAvatar = params.get('showAvatar');
  if (showAvatar !== null) config.showAvatar = parseBoolean(showAvatar, true);

  const showReply = params.get('showReply');
  if (showReply !== null) config.showReply = parseBoolean(showReply, true);

  const hideGlobalReviews = params.get('hideGlobalReviews');
  if (hideGlobalReviews !== null)
    config.hideGlobalReviews = parseBoolean(hideGlobalReviews, false);

  const hideTopBanner = params.get('hideTopBanner');
  if (hideTopBanner !== null)
    config.hideTopBanner = parseBoolean(hideTopBanner, false);

  const height = params.get('height');
  if (height) config.height = parseNumber(height, 400, 200, 800);

  const width = params.get('width');
  if (width) {
    // Try to parse as number first, otherwise keep as string
    const numWidth = parseFloat(width);
    config.width = isNaN(numWidth) ? width : numWidth;
  }

  // Enhanced color customization
  const backgroundColor = params.get('backgroundColor');
  if (backgroundColor) config.backgroundColor = backgroundColor;

  const textColor = params.get('textColor');
  if (textColor) config.textColor = textColor;

  const primaryColor = params.get('primaryColor');
  if (primaryColor) config.primaryColor = primaryColor;

  const surfaceColor = params.get('surfaceColor');
  if (surfaceColor) config.surfaceColor = surfaceColor;

  const borderColor = params.get('borderColor');
  if (borderColor) config.borderColor = borderColor;

  const starColor = params.get('starColor');
  if (starColor) config.starColor = starColor;

  // Transparency support
  const transparent = params.get('transparent');
  if (transparent !== null)
    config.transparent = parseBoolean(transparent, true);

  return config;
}

/**
 * Converts configuration object to URL search params
 */
export function configToSearchParams(
  config: Partial<CarrouselConfig>
): URLSearchParams {
  const params = new URLSearchParams();

  Object.entries(config).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  });

  return params;
}

/**
 * Updates URL with new configuration (client-side only)
 */
export function updateURLWithConfig(config: Partial<CarrouselConfig>): void {
  if (typeof window === 'undefined') return;

  const params = configToSearchParams(config);
  const newUrl = `${window.location.pathname}?${params.toString()}`;

  // Update URL without page reload
  window.history.replaceState({}, '', newUrl);
}
