import { CarrouselConfig } from './types';
import { darkTheme, lightTheme, transparentTheme } from './utils';

// ============================================
// DEFAULT CONFIGURATION
// ============================================

export const DEFAULT_CONFIG: Required<CarrouselConfig> = {
  domain: '',
  page: 1,
  autoplay: true,
  interval: 5000,
  theme: 'light',
  maxReviews: 10,
  minRating: 1,
  language: 'en',
  showRating: true,
  showDate: true,
  showAvatar: true,
  showReply: true,
  height: 400,
  width: '100%',
  hideRating: false,
  hideDate: false,
  hideAvatar: false,
  hideReply: false,
  hideGlobalReviews: false,
  hideTopBanner: false,
  autoHeight: false,
  // Enhanced color customization
  backgroundColor: 'transparent',
  textColor: '#191919',
  primaryColor: '#00b67a',
  surfaceColor: '#ffffff',
  borderColor: '#e5e7eb',
  starColor: '#ffc107',
  // Transparency support (default to transparent)
  transparent: true,
};

// ============================================
// API CONFIGURATION
// ============================================

export const API_CONFIG = {
  baseUrl: process.env.EXTERNAL_API_BASE_URL,
  timeout: 10000, // 10 seconds
  retries: 3,
  cache: {
    ttl: parseInt(process.env.CACHE_TTL_SECONDS || '300') * 1000, // 5 minutes in ms
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'), // 1 minute
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },
} as const;

// ============================================
// THEME CONFIGURATION
// ============================================

export const THEME_CONFIG = {
  light: lightTheme,
  dark: darkTheme,
  custom: transparentTheme,
} as const;

// ============================================
// CARROUSEL CONFIGURATION
// ============================================

export const CARROUSEL_CONFIG = {
  themes: THEME_CONFIG,
  defaults: DEFAULT_CONFIG,
  api: API_CONFIG,
} as const;

// ============================================
// SWIPER CONFIGURATION
// ============================================

export const SWIPER_CONFIG = {
  spaceBetween: 16,
  slidesPerView: 1,
  breakpoints: {
    640: {
      slidesPerView: 1,
      spaceBetween: 16,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 24,
    },
  },
  autoplay: {
    delay: DEFAULT_CONFIG.interval,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  pagination: {
    clickable: true,
    dynamicBullets: true,
  },
  navigation: {
    enabled: true,
  },
  loop: true,
  grabCursor: true,
  keyboard: {
    enabled: true,
    onlyInViewport: true,
  },
  a11y: {
    prevSlideMessage: 'Previous review',
    nextSlideMessage: 'Next review',
    paginationBulletMessage: 'Go to review {{index}}',
  },
} as const;

// ============================================
// VALIDATION CONSTANTS
// ============================================

export const VALIDATION = {
  domain: {
    minLength: 1,
    pattern:
      /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i,
  },
  rating: {
    min: 1,
    max: 5,
  },
  interval: {
    min: 1000, // 1 second
    max: 30000, // 30 seconds
  },
  maxReviews: {
    min: 1,
    max: 50,
  },
  height: {
    min: 200,
    max: 800,
  },
} as const;

// ============================================
// ERROR MESSAGES
// ============================================

export const ERROR_MESSAGES = {
  VALIDATION_ERROR: 'Invalid request parameters',
  INVALID_DOMAIN: 'The provided domain is not valid or not found on Trustpilot',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please try again later.',
  EXTERNAL_API_ERROR: 'Error fetching data from external API',
  TIMEOUT: 'Request timeout. Please try again.',
  INTERNAL_SERVER_ERROR: 'An internal server error occurred',
  CLIENT_ERROR: 'Failed to fetch reviews',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  NO_REVIEWS_FOUND: 'No reviews found for this domain',
  INVALID_CONFIGURATION: 'Invalid configuration parameters',
} as const;

// ============================================
// SUPPORTED LANGUAGES
// ============================================

export const SUPPORTED_LANGUAGES = [
  'en',
  'es',
  'fr',
  'de',
  'it',
  'pt',
  'nl',
  'da',
  'sv',
  'no',
  'fi',
  'pl',
  'cs',
  'sk',
  'hu',
  'ro',
  'bg',
  'hr',
  'sl',
  'et',
  'lv',
  'lt',
] as const;

// ============================================
// CORS CONFIGURATION
// ============================================

export const CORS_CONFIG = {
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['*'],
  allowedMethods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: false,
  maxAge: 86400, // 24 hours
} as const;

// ============================================
// PERFORMANCE CONFIGURATION
// ============================================

export const PERFORMANCE_CONFIG = {
  lazyLoading: true,
  preloadImages: 2, // Number of images to preload
  debounceDelay: 300, // ms for search debouncing
  throttleDelay: 100, // ms for scroll/resize throttling
  animationDuration: 300, // ms for transitions
} as const;

// ============================================
// DEVELOPMENT CONFIGURATION
// ============================================

export const DEV_CONFIG = {
  enableLogging: process.env.NODE_ENV === 'development',
  enableDevtools: process.env.NODE_ENV === 'development',
  mockData:
    process.env.NODE_ENV === 'development' &&
    process.env.USE_MOCK_DATA === 'true',
} as const;

// ============================================
// SOCIAL MEDIA CONFIGURATION
// ============================================

export const SOCIAL_CONFIG = {
  trustpilot: {
    baseUrl: 'https://www.trustpilot.com',
    logoUrl: 'https://cdn.trustpilot.net/brand-assets/4.3.0/logo-white.svg',
    colors: {
      green: '#00b67a',
      darkGreen: '#00834d',
    },
  },
} as const;

// ============================================
// UTILITY FUNCTIONS FOR CONFIG
// ============================================

/**
 * Merges user config with default config
 */
export function mergeConfig(
  userConfig: Partial<CarrouselConfig>
): Required<CarrouselConfig> {
  return {
    ...DEFAULT_CONFIG,
    ...userConfig,
  } as Required<CarrouselConfig>;
}

/**
 * Validates configuration object
 */
export function validateConfig(config: Partial<CarrouselConfig>): string[] {
  const errors: string[] = [];

  if (!config.domain || config.domain.trim().length === 0) {
    errors.push('Domain is required');
  }

  if (config.domain && !VALIDATION.domain.pattern.test(config.domain)) {
    errors.push('Invalid domain format');
  }

  if (
    config.minRating &&
    (config.minRating < VALIDATION.rating.min ||
      config.minRating > VALIDATION.rating.max)
  ) {
    errors.push(
      `Rating must be between ${VALIDATION.rating.min} and ${VALIDATION.rating.max}`
    );
  }

  if (
    config.interval &&
    (config.interval < VALIDATION.interval.min ||
      config.interval > VALIDATION.interval.max)
  ) {
    errors.push(
      `Interval must be between ${VALIDATION.interval.min} and ${VALIDATION.interval.max} milliseconds`
    );
  }

  if (
    config.maxReviews &&
    (config.maxReviews < VALIDATION.maxReviews.min ||
      config.maxReviews > VALIDATION.maxReviews.max)
  ) {
    errors.push(
      `Max reviews must be between ${VALIDATION.maxReviews.min} and ${VALIDATION.maxReviews.max}`
    );
  }

  if (
    config.height &&
    (config.height < VALIDATION.height.min ||
      config.height > VALIDATION.height.max)
  ) {
    errors.push(
      `Height must be between ${VALIDATION.height.min} and ${VALIDATION.height.max} pixels`
    );
  }

  if (
    config.language &&
    !SUPPORTED_LANGUAGES.includes(
      config.language as (typeof SUPPORTED_LANGUAGES)[number]
    )
  ) {
    errors.push(`Language '${config.language}' is not supported`);
  }

  return errors;
}

/**
 * Gets environment-specific configuration
 */
export function getEnvConfig() {
  return {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
    apiBaseUrl: process.env.EXTERNAL_API_BASE_URL || API_CONFIG.baseUrl,
    cacheTtl: API_CONFIG.cache.ttl,
    rateLimit: API_CONFIG.rateLimit,
  };
}
