// Environment configuration loader
// This ensures environment variables are properly loaded in all contexts
import dotenv from 'dotenv';
// Only load dotenv on server-side and if it hasn't been loaded already
if (typeof window === 'undefined' && !process.env.ENV_LOADED) {
  try {
    // Load environment variables in the correct order (Next.js priority)
    dotenv.config({ path: '.env', override: false });

    // Mark as loaded to prevent multiple loads
    process.env.ENV_LOADED = 'true';

    console.log('[ENV] Environment variables loaded');
    console.log(
      '[ENV] EXTERNAL_API_BASE_URL:',
      process.env.EXTERNAL_API_BASE_URL
    );
  } catch (error) {
    console.warn(
      '[ENV] Failed to load environment variables:',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

export const ENV_CONFIG = {
  API_BASE_URL:
    process.env.EXTERNAL_API_BASE_URL || 'https://api.trustpilot.com',
  CACHE_TYPE: process.env.CACHE_TYPE || 'memory',
  CACHE_TTL_SECONDS: parseInt(process.env.CACHE_TTL_SECONDS || '1800'),
  CACHE_MAX_ITEMS: parseInt(process.env.CACHE_MAX_ITEMS || '1000'),
  CACHE_MAX_MEMORY_MB: parseInt(process.env.CACHE_MAX_MEMORY_MB || '50'),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
  RATE_LIMIT_MAX_REQUESTS: parseInt(
    process.env.RATE_LIMIT_MAX_REQUESTS || '100'
  ),
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;
