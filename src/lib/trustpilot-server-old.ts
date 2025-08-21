import { z } from 'zod';
import { cache } from './cache';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface Review {
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

export interface CompanyInfo {
  name: string;
  domain: string;
  average_rating: number;
  total_reviews: number;
  trustpilot_url: string;
}

export interface ReviewsData {
  reviews: Review[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_reviews: number;
    per_page: number;
  };
  company: CompanyInfo;
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

const ReviewSchema = z.object({
  id: z.string(),
  author: z.object({
    name: z.string(),
    avatar: z.string().optional(),
    location: z.string().optional(),
  }),
  rating: z.number().min(1).max(5),
  title: z.string(),
  content: z.string(),
  date: z.string(),
  verified: z.boolean(),
  helpful: z.number().optional(),
  reply: z
    .object({
      content: z.string(),
      date: z.string(),
      author: z.string(),
    })
    .optional(),
});

const CompanySchema = z.object({
  name: z.string(),
  domain: z.string(),
  average_rating: z.number(),
  total_reviews: z.number(),
  trustpilot_url: z.string(),
});

const PaginationSchema = z.object({
  current_page: z.number(),
  total_pages: z.number(),
  total_reviews: z.number(),
  per_page: z.number(),
});

const ApiResponseSchema = z
  .object({
    success: z.boolean().optional().default(true),
    data: z
      .object({
        reviews: z.array(ReviewSchema).optional().default([]),
        pagination: PaginationSchema.optional(),
        company: CompanySchema.optional(),
      })
      .optional(),
    error: z
      .object({
        code: z.string(),
        message: z.string(),
        details: z.any().optional(),
      })
      .optional(),
  })
  .passthrough(); // Allow additional properties

// ============================================
// RATE LIMITING
// ============================================

const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const RATE_LIMIT_MAX_REQUESTS = 100;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }

  const requests = rateLimitMap.get(ip)!;
  const validRequests = requests.filter(time => time > windowStart);

  if (validRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  validRequests.push(now);
  rateLimitMap.set(ip, validRequests);
  return true;
}

// ============================================
// TRUSTPILOT SERVER CLIENT
// ============================================

class TrustpilotServerClient {
  private baseUrl: string;
  private apiKey?: string;

  constructor() {
    this.baseUrl =
      process.env.EXTERNAL_API_BASE_URL ||
      'https://api.trustpilot.com';
    this.apiKey = process.env.TRUSTPILOT_API_KEY;
  }

  /**
   * Fetch reviews from Trustpilot API on the server side
   */
  async fetchReviews(
    params: FetchReviewsParams,
    clientIP?: string
  ): Promise<ReviewsData> {
    try {
      // Rate limiting check
      if (clientIP && !checkRateLimit(clientIP)) {
        throw new Error('Rate limit exceeded');
      }

      // Check cache first
      const cacheKey = this.buildCacheKey(params);
      const cachedData = await cache.get<ReviewsData>(cacheKey);

      if (cachedData) {
        console.log(`Cache hit for key: ${cacheKey}`);
        return cachedData;
      }

      // Build URL for external API
      const url = this.buildApiUrl(params);
      console.log(`Fetching from: ${url}`);

      // Make the request
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'TrustpilotCarrouselWidget/1.0',
          Accept: 'application/json',
          ...(this.apiKey && { Authorization: `Bearer ${this.apiKey}` }),
        },
        // 10 second timeout
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        throw new Error(
          `External API error: ${response.status} ${response.statusText}`
        );
      }

      const rawData = await response.json();
      console.log('Raw API response:', JSON.stringify(rawData, null, 2));

      // Handle different response formats
      let reviewsData: ReviewsData;

      if (rawData.success !== undefined) {
        // Expected format with success field
        const validatedResponse = ApiResponseSchema.parse(rawData);

        if (!validatedResponse.success || !validatedResponse.data) {
          throw new Error(
            validatedResponse.error?.message ||
              'Invalid response from Trustpilot API'
          );
        }

        reviewsData = {
          reviews: validatedResponse.data.reviews || [],
          pagination: validatedResponse.data.pagination || {
            current_page: 1,
            total_pages: 1,
            total_reviews: validatedResponse.data.reviews?.length || 0,
            per_page: params.limit || 10,
          },
          company: validatedResponse.data.company || {
            name: params.domain,
            domain: params.domain,
            average_rating: 0,
            total_reviews: 0,
            trustpilot_url: `https://trustpilot.com/review/${params.domain}`,
          },
        };
      } else {
        // Handle direct data format (no success wrapper)
        reviewsData = {
          reviews: Array.isArray(rawData) ? rawData.slice(0, 10) : [],
          pagination: {
            current_page: 1,
            total_pages: 1,
            total_reviews: Array.isArray(rawData) ? rawData.length : 0,
            per_page: params.limit || 10,
          },
          company: {
            name: params.domain,
            domain: params.domain,
            average_rating: 0,
            total_reviews: Array.isArray(rawData) ? rawData.length : 0,
            trustpilot_url: `https://trustpilot.com/review/${params.domain}`,
          },
        };
      }

      // Cache the response
      await cache.set(cacheKey, reviewsData, 300); // 5 minutes TTL

      return reviewsData;
    } catch (error) {
      console.error('TrustpilotServerClient Error:', error);

      // Return empty state for graceful degradation
      return {
        reviews: [],
        pagination: {
          current_page: 1,
          total_pages: 0,
          total_reviews: 0,
          per_page: params.limit || 10,
        },
        company: {
          name: params.domain,
          domain: params.domain,
          average_rating: 0,
          total_reviews: 0,
          trustpilot_url: `https://trustpilot.com/review/${params.domain}`,
        },
      };
    }
  }

  /**
   * Build cache key for the request
   */
  private buildCacheKey(params: FetchReviewsParams): string {
    const { domain, page = 1, limit = 10, rating, sort = 'latest' } = params;
    return `reviews:${domain}:${page}:${limit}:${rating || 'all'}:${sort}`;
  }

  /**
   * Build URL for external API call
   */
  private buildApiUrl(params: FetchReviewsParams): string {
    const { domain, page = 1, limit = 10, rating, sort = 'latest' } = params;

    const url = new URL(this.baseUrl);
    // Set path to be /feedbacks/filtered
    url.pathname = '/feedbacks/filtered';
    url.searchParams.set('domain', domain);
    url.searchParams.set('page', page.toString());

    if (limit !== 10) {
      url.searchParams.set('limit', limit.toString());
    }

    if (rating) {
      // The rating has to be sent as stars separated by a comma 3,4
      // Rating is the maximum number of stars and stars go from 1-5
      // For rating 4, you have to send 4,5 in stars
      const stars = [];
      for (let i = rating; i <= 5; i++) {
        stars.push(i.toString());
      }
      url.searchParams.set('stars', stars.join(','));
    }

    if (sort !== 'latest') {
      url.searchParams.set('sort', sort);
    }

    return url.toString();
  }

  /**
   * Validate and sanitize domain parameter
   */
  static validateDomain(domain: string): boolean {
    try {
      // Basic domain validation
      const domainRegex =
        /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*$/;
      return domainRegex.test(domain) && domain.length <= 253;
    } catch {
      return false;
    }
  }

  /**
   * Get client IP from request headers (for rate limiting)
   */
  static getClientIP(
    headers: Record<string, string | string[] | undefined>
  ): string {
    const forwarded = headers['x-forwarded-for'];
    const realIP = headers['x-real-ip'];
    const remoteAddress = headers['x-remote-address'];

    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }

    if (typeof realIP === 'string') {
      return realIP;
    }

    if (typeof remoteAddress === 'string') {
      return remoteAddress;
    }

    return 'unknown';
  }
}

// ============================================
// SINGLETON EXPORT
// ============================================

// ============================================
// SINGLETON EXPORT
// ============================================

export const trustpilotServer = new TrustpilotServerClient();

// Export class for static methods
export { TrustpilotServerClient };

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Helper function to fetch reviews with error handling
 */
export async function getReviewsData(
  params: FetchReviewsParams,
  clientIP?: string
): Promise<ReviewsData | null> {
  try {
    if (!TrustpilotServerClient.validateDomain(params.domain)) {
      throw new Error('Invalid domain format');
    }

    return await trustpilotServer.fetchReviews(params, clientIP);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return null;
  }
}
