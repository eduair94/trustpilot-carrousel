import { z } from 'zod';
import { cache } from './cache';
import {
  BusinessUnit,
  Review,
  TrustpilotResponse,
} from './trustpilot.interface';

// ============================================
// NORMALIZED TYPES FOR COMPONENTS
// ============================================

export interface NormalizedReview {
  id: string;
  author: {
    name: string;
    avatar?: string;
    location?: string;
  };
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  helpful?: number;
  reply?: {
    content: string;
    date: string;
    author: string;
  };
}

export interface NormalizedCompanyInfo {
  name: string;
  domain: string;
  average_rating: number;
  total_reviews: number;
  trustpilot_url: string;
}

export interface NormalizedReviewsData {
  reviews: NormalizedReview[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_reviews: number;
    per_page: number;
  };
  company: NormalizedCompanyInfo;
}

export interface FetchReviewsParams {
  domain: string;
  page?: number;
  limit?: number;
  rating?: number;
  sort?: 'latest' | 'rating';
}

// ============================================
// VALIDATION SCHEMAS
// ============================================

const TrustpilotConsumerSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  imageUrl: z.string(),
  numberOfReviews: z.number(),
  countryCode: z.string(),
  hasImage: z.boolean(),
  isVerified: z.boolean(),
});

const TrustpilotDatesSchema = z.object({
  experiencedDate: z.string(),
  publishedDate: z.string(),
  updatedDate: z.string().nullable(),
  submittedDate: z.string().nullable(),
});

const TrustpilotLabelsSchema = z
  .object({
    verification: z.object({
      isVerified: z.boolean(),
      createdDateTime: z.string(),
      reviewSourceName: z.string(),
      verificationSource: z.string(),
      verificationLevel: z.string(),
      hasDachExclusion: z.boolean(),
    }),
  })
  .optional();

const TrustpilotReviewSchema = z.object({
  id: z.string(),
  filtered: z.boolean(),
  pending: z.boolean(),
  text: z.string(),
  rating: z.number(),
  labels: TrustpilotLabelsSchema,
  title: z.string(),
  likes: z.number(),
  source: z.string(),
  dates: TrustpilotDatesSchema,
  report: z.any().nullable(),
  hasUnhandledReports: z.boolean(),
  consumer: TrustpilotConsumerSchema,
  reply: z.any().nullable(),
  consumersReviewCountOnSameDomain: z.number(),
  consumersReviewCountOnSameLocation: z.any().nullable(),
  productReviews: z.array(z.any()),
  language: z.string(),
  location: z.any().nullable(),
});

const BusinessUnitSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  identifyingName: z.string(),
  numberOfReviews: z.number(),
  trustScore: z.number(),
  websiteUrl: z.string(),
  stars: z.number(),
});

const FiltersSchema = z.object({
  pagination: z.object({
    currentPage: z.number(),
    perPage: z.number(),
    totalCount: z.number(),
    totalPages: z.number(),
  }),
  totalNumberOfReviews: z.number(),
  totalNumberOfFilteredReviews: z.number(),
});

const TrustpilotResponseSchema = z.object({
  domain: z.string(),
  businessUnit: BusinessUnitSchema,
  reviews: z.array(TrustpilotReviewSchema),
  filters: FiltersSchema,
});

const FetchReviewsParamsSchema = z.object({
  domain: z.string().min(1, 'Domain is required'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  rating: z.coerce.number().min(1).max(5).optional(),
  sort: z.enum(['latest', 'rating']).default('latest'),
});

function normalizeTrustpilotReview(review: Review): NormalizedReview {
  // Helper function to truncate text at word boundaries
  const smartTruncate = (text: string, maxLength: number): string => {
    if (!text || text.length <= maxLength) return text;
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > maxLength * 0.8
      ? truncated.substring(0, lastSpace) + '...'
      : truncated + '...';
  };

  return {
    id: review.id,
    title:
      review.title ||
      (review.text ? smartTruncate(review.text, 60) : 'No title'),
    content: review.text || 'No content',
    author: {
      name: review.consumer?.displayName || 'Anonymous',
      avatar: review.consumer?.imageUrl || undefined,
      location: review.consumer?.countryCode || undefined,
    },
    rating: review.rating || 0,
    date: review.dates?.publishedDate || new Date().toISOString(),
    verified: review.consumer?.isVerified || false,
    helpful: review.likes || 0,
    reply: undefined, // Reply is null in the interface, so we set to undefined
  };
}

function normalizeTrustpilotCompany(
  businessUnit: BusinessUnit
): NormalizedCompanyInfo {
  return {
    name:
      businessUnit.displayName ||
      businessUnit.identifyingName ||
      'Unknown Company',
    domain: businessUnit.websiteUrl || '',
    average_rating: businessUnit.trustScore || 0,
    total_reviews: businessUnit.numberOfReviews || 0,
    trustpilot_url:
      `https://www.trustpilot.com/review/${businessUnit.identifyingName}` || '',
  };
}

function normalizeTrustpilotResponse(
  data: TrustpilotResponse
): NormalizedReviewsData {
  // Extract pagination from filters
  const pagination = data.filters?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalCount: data.reviews?.length || 0,
    perPage: 20,
  };

  return {
    reviews: data.reviews?.map(normalizeTrustpilotReview) || [],
    pagination: {
      current_page: pagination.currentPage,
      total_pages: pagination.totalPages,
      total_reviews: pagination.totalCount,
      per_page: pagination.perPage,
    },
    company: normalizeTrustpilotCompany(data.businessUnit),
  };
}

// ============================================
// SERVER CLIENT CLASS
// ============================================

class TrustpilotServerClient {
  private static readonly API_URL = process.env.EXTERNAL_API_BASE_URL || 'https://api.trustpilot.com';
  private static readonly RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
  private static readonly MAX_REQUESTS_PER_WINDOW = 30;

  private requestCounts = new Map<
    string,
    { count: number; resetTime: number }
  >();

  /**
   * Validates a domain string
   */
  static validateDomain(domain: string): boolean {
    if (!domain || typeof domain !== 'string') return false;

    const domainRegex =
      /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return domainRegex.test(domain);
  }

  /**
   * Gets client IP from headers
   */
  static getClientIP(headers: Record<string, string>): string {
    return (
      headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      headers['x-real-ip'] ||
      '127.0.0.1'
    );
  }

  /**
   * Rate limiting check
   */
  private checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const key = `rate_limit:${ip}`;

    const current = this.requestCounts.get(key);

    if (!current || now > current.resetTime) {
      // Reset or create new window
      this.requestCounts.set(key, {
        count: 1,
        resetTime: now + TrustpilotServerClient.RATE_LIMIT_WINDOW,
      });
      return {
        allowed: true,
        remaining: TrustpilotServerClient.MAX_REQUESTS_PER_WINDOW - 1,
      };
    }

    if (current.count >= TrustpilotServerClient.MAX_REQUESTS_PER_WINDOW) {
      return { allowed: false, remaining: 0 };
    }

    current.count++;
    return {
      allowed: true,
      remaining: TrustpilotServerClient.MAX_REQUESTS_PER_WINDOW - current.count,
    };
  }

  /**
   * Makes HTTP request to Trustpilot API
   */
  private async makeRequest(
    params: FetchReviewsParams
  ): Promise<TrustpilotResponse | null> {
    try {
      const url = new URL(TrustpilotServerClient.API_URL);
      url.searchParams.set('domain', params.domain);

      if (params.page && params.page > 1) {
        url.searchParams.set('page', params.page.toString());
      }

      if (params.limit) {
        url.searchParams.set('limit', params.limit.toString());
      }

      if (params.rating) {
        url.searchParams.set('rating', params.rating.toString());
      }

      if (params.sort) {
        url.searchParams.set('sort', params.sort);
      }

      console.log(`[TrustpilotServer] Making request to: ${url.toString()}`);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'TrustpilotCarrousel/1.0.0',
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      });

      if (!response.ok) {
        console.error(
          `[TrustpilotServer] API request failed: ${response.status} ${response.statusText}`
        );

        // Try to get error details from response
        const errorText = await response.text();
        console.error(`[TrustpilotServer] Error details: ${errorText}`);

        return null;
      }

      const data = await response.json();
      console.log(
        `[TrustpilotServer] Successfully fetched data for domain: ${params.domain}`
      );
      console.log(
        `[TrustpilotServer] Reviews found: ${data.reviews?.length || 0}`
      );

      return data;
    } catch (error) {
      console.error('[TrustpilotServer] Network error:', error);
      return null;
    }
  }

  /**
   * Fetches reviews with caching and rate limiting
   */
  async fetchReviews(
    params: FetchReviewsParams,
    clientIP: string
  ): Promise<NormalizedReviewsData | null> {
    try {
      // Validate parameters
      const validatedParams = FetchReviewsParamsSchema.parse(params);

      // Validate domain
      if (!TrustpilotServerClient.validateDomain(validatedParams.domain)) {
        console.error(
          `[TrustpilotServer] Invalid domain: ${validatedParams.domain}`
        );
        return null;
      }

      // Check rate limiting
      const rateLimitCheck = this.checkRateLimit(clientIP);
      if (!rateLimitCheck.allowed) {
        console.warn(
          `[TrustpilotServer] Rate limit exceeded for IP: ${clientIP}`
        );
        return null;
      }

      console.log('Validate params', validatedParams);

      // Generate cache key
      const cacheKey = `trustpilot:${validatedParams.domain}:${validatedParams.page}:${validatedParams.limit}:${validatedParams.rating || 'all'}:${validatedParams.sort}`;

      // Try to get from cache
      const cachedData = await cache.get<NormalizedReviewsData>(cacheKey);
      if (cachedData) {
        console.log(`[TrustpilotServer] Cache hit for: ${cacheKey}`);
        return cachedData;
      }

      // Fetch from API
      const apiResponse = await this.makeRequest(validatedParams);
      if (!apiResponse) {
        return null;
      }

      // Normalize the response
      const normalizedData = normalizeTrustpilotResponse(apiResponse);

      // Cache the normalized data for 30 minutes (1800 seconds)
      cache.set(cacheKey, normalizedData, 1800);

      console.log(
        `[TrustpilotServer] Data cached with key: ${cacheKey} (TTL: 30 minutes)`
      );

      // Log cache stats periodically
      if (Math.random() < 0.1) {
        // 10% chance to log stats
        const stats = (cache as any).getStats?.();
        if (stats) {
          console.log(
            `[TrustpilotServer] Cache stats: ${stats.items} items, ` +
              `${stats.memoryUsageMB.toFixed(2)}MB used (max: ${stats.maxMemoryMB}MB)`
          );
        }
      }

      return normalizedData;
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('[TrustpilotServer] Validation error:', error.issues);
      } else {
        console.error('[TrustpilotServer] Unexpected error:', error);
      }
      return null;
    }
  }
}

// ============================================
// SINGLETON EXPORT
// ============================================

export const trustpilotServer = new TrustpilotServerClient();

// Export class for static methods
export { TrustpilotServerClient };

// ============================================
// CONVENIENCE FUNCTION
// ============================================

/**
 * Main function to get reviews data
 */
export async function getReviewsData(
  params: FetchReviewsParams,
  clientIP: string = '127.0.0.1'
): Promise<NormalizedReviewsData | null> {
  return trustpilotServer.fetchReviews(params, clientIP);
}
