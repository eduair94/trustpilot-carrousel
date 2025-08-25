import { TrustpilotIframeConfig, VanillaTrustpilotConfig } from './types';

/**
 * Base URL for the Trustpilot iframe service
 * This is forced to be the specific URL as requested
 */
const BASE_URL = 'https://trustpilot.checkleaked.com';

/**
 * Build the iframe URL with query parameters
 */
export function buildIframeUrl(config: TrustpilotIframeConfig): string {
  const url = new URL(BASE_URL);

  // Required domain parameter
  url.searchParams.set('domain', config.domain);

  // Optional parameters
  if (config.theme && config.theme !== 'auto') {
    url.searchParams.set('theme', config.theme);
  }

  if (config.autoplay !== undefined) {
    url.searchParams.set('autoplay', config.autoplay.toString());
  }

  if (config.interval !== undefined) {
    url.searchParams.set('interval', config.interval.toString());
  }

  if (config.maxReviews !== undefined) {
    url.searchParams.set('maxReviews', config.maxReviews.toString());
  }

  if (config.showRating !== undefined) {
    url.searchParams.set('showRating', config.showRating.toString());
  }

  if (config.showDate !== undefined) {
    url.searchParams.set('showDate', config.showDate.toString());
  }

  if (config.showAvatar !== undefined) {
    url.searchParams.set('showAvatar', config.showAvatar.toString());
  }

  if (config.showReply !== undefined) {
    url.searchParams.set('showReply', config.showReply.toString());
  }

  if (config.hideGlobalReviews !== undefined) {
    url.searchParams.set(
      'hideGlobalReviews',
      config.hideGlobalReviews.toString()
    );
  }

  if (config.hideTopBanner !== undefined) {
    url.searchParams.set('hideTopBanner', config.hideTopBanner.toString());
  }

  if (config.height !== undefined) {
    url.searchParams.set('height', config.height.toString());
  }

  if (config.page !== undefined) {
    url.searchParams.set('page', config.page.toString());
  }

  if (config.limit !== undefined) {
    url.searchParams.set('limit', config.limit.toString());
  }

  if (config.rating !== undefined) {
    url.searchParams.set('rating', config.rating.toString());
  }

  if (config.sort !== undefined) {
    url.searchParams.set('sort', config.sort);
  }

  // Handle custom colors
  if (config.colors) {
    Object.entries(config.colors).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(`color-${key}`, value);
      }
    });
  }

  return url.toString();
}

/**
 * Validate domain format
 */
export function validateDomain(domain: string): boolean {
  if (!domain || typeof domain !== 'string') {
    return false;
  }

  // Basic domain validation regex
  const domainRegex =
    /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return domainRegex.test(domain);
}

/**
 * Generate a unique ID for iframe elements
 */
export function generateIframeId(): string {
  return `trustpilot-iframe-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: Partial<TrustpilotIframeConfig> = {
  theme: 'auto',
  autoplay: true,
  interval: 5000,
  maxReviews: 20,
  showRating: true,
  showDate: true,
  showAvatar: true,
  showReply: true,
  hideGlobalReviews: false,
  hideTopBanner: false,
  height: 400,
  page: 1,
  limit: 20,
  sort: 'latest',
};

/**
 * Merge user config with defaults
 */
export function mergeConfig(
  userConfig: TrustpilotIframeConfig
): TrustpilotIframeConfig {
  return {
    ...DEFAULT_CONFIG,
    ...userConfig,
  };
}

/**
 * Merge vanilla config with defaults (preserves target property)
 */
export function mergeVanillaConfig(
  userConfig: VanillaTrustpilotConfig
): VanillaTrustpilotConfig {
  const { target, ...configWithoutTarget } = userConfig;
  return {
    target,
    ...DEFAULT_CONFIG,
    ...configWithoutTarget,
  };
}

/**
 * Create iframe element with proper attributes
 */
export function createIframeElement(
  src: string,
  id: string,
  title: string = 'Trustpilot Reviews'
): HTMLIFrameElement {
  const iframe = document.createElement('iframe');

  iframe.id = id;
  iframe.src = src;
  iframe.title = title;
  iframe.style.width = '100%';
  iframe.style.border = 'none';
  iframe.style.overflow = 'hidden';
  iframe.setAttribute('scrolling', 'no');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allowtransparency', 'true');

  // Accessibility attributes
  iframe.setAttribute('role', 'region');
  iframe.setAttribute('aria-label', 'Trustpilot customer reviews');

  return iframe;
}

/**
 * Debounce function for resize events
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
